import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { CognitoUser } from "@aws-amplify/auth";
import { confirmSignInWithMfa } from "../../lib/auth/auth";
import { useAuth } from "../../AuthContext";

export default function ProcessMFA({ user }: { user: CognitoUser | null }) {
  const [errorMessage, setErrorMessage] = useState("");
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
    try {
      const cognitoUser = await confirmSignInWithMfa(user, otp);
      auth.addSessionToContext(cognitoUser);
      navigate("/");
    } catch (error: any) {
      const errorObj = error as { message: string };
      setErrorMessage(errorObj.message);
    }
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
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          One Time Passcode
        </Typography>
        {errorMessage ? (
          <Alert
            severity="error"
            sx={{ marginTop: "10px", marginBottom: "20px" }}
          >
            {errorMessage}
          </Alert>
        ) : (
          <Alert
            severity="info"
            sx={{ marginTop: "10px", marginBottom: "20px" }}
          >
            A One Time Passcode (OTP) helps to protect you from malicious
            actors.
          </Alert>
        )}
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
