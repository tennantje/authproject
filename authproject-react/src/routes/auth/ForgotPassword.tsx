import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { startForgetPasswordFlow } from "../../lib/auth/auth";
import Alert from "@mui/material/Alert";
import ForgotPasswordReset from "./ForgotPasswordConfirmation";

export default function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `AuthProject | Forgot Password`;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = (data.get("email") as string) || "";
    try {
      await startForgetPasswordFlow(email);
      navigate(
        `/forgot-password-confirmation?email=${encodeURIComponent(email)}`
      );
    } catch (error) {
      console.log(error);
      const errorObj = error as { message: string };
      setErrorMessage(errorObj.message.replaceAll("Username", "Email"));
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
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
            If you&apos;ve fogotten your password, please complete the form
            below and we&apos;ll email you a temporary password.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset my password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/signin">Didn&apos;t forget? Sign in</Link>
            </Grid>
            <Grid item>
              <Link to="/signup">Don&apos;t have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
