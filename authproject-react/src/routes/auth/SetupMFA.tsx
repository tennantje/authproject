import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QRCodeSVG } from "qrcode.react";
import { CognitoUser } from "@aws-amplify/auth";
import { verifyTOTP } from "../../lib/auth/auth";
import { useAuth } from "../../AuthContext";

export default function SetupMFA({
  user,
  secret,
}: {
  user: CognitoUser | null;
  secret: string;
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    document.title = `AuthProject | Setup MFA`;
  }, []);

  if (!user) {
    return <></>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const otp = data.get("otp") as string;
    const resp = await verifyTOTP(user, otp);
    auth.addSessionToContext(user);
    navigate("/");
  };

  const formattedCode = `otpauth://totp/AWSCognito:${encodeURIComponent(
    user.getUsername()
  )}?secret=${secret}&issuer=AuthProject`;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          AuthProject requires MFA
        </Typography>
        <hr />
        <Alert severity="info">
          Multifactor Authentication (or MFA) helps to keep your account safe
          from malicious actors. When you sign in, you'll need to provide your
          password as well as a One Time Password (OTP).
        </Alert>
        <ol>
          <li>
            Install an application like <a href="https://authy.com">Authy</a> or{" "}
            <a href="https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DAndroid">
              Google Authenticator
            </a>{" "}
            on your device
          </li>
          <li>
            Scan the QR Code displayed below within Authy, or Google
            Authenticator.
          </li>
          <li>
            A One Time Password (OTP) will be displayed on screen. Enter the OTP
            in the box below to continue.
          </li>
        </ol>
        <Typography component="h3" variant="body1"></Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container justifyContent={"center"} alignItems={"center"}>
            <Grid item xs>
              <QRCodeSVG value={formattedCode} />
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="One Time Password (OTP)"
            name="otp"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Setup MFA
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
