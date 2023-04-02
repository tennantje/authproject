import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { CognitoUser } from "@aws-amplify/auth";
import { confirmSignInWithMfa } from "../../lib/auth/auth";
import { useAuth } from "../../AuthContext";

export default function ProcessMFA({ user }: { user: CognitoUser | null }) {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    document.title = `AuthProject | Signin`;
  }, []);

  if (!user) {
    return <></>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const otp = data.get("otp") as string;
    const u = await confirmSignInWithMfa(user, otp);
    auth.addSessionToContext(u);
    navigate("/");
  };

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
          One Time Passcode
        </Typography>
        <hr />
        <Alert severity="info">
          A One Time Passcode (OTP) helps to protect you from malicious actors.
        </Alert>

        <Typography component="h3" variant="body1"></Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="MFA Code"
            name="otp"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            SIGN IN WITH OTP
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
