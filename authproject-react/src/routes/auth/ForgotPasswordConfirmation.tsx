import React, { useEffect, useState } from "react";
import { useLoaderData, useActionData, Form, redirect } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { setNewForgottenPassword } from "../../lib/auth/auth";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  return { email };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const email = (formObject.email || "") as string;
  const code = (formObject.code || "") as string;
  const newPassword = (formObject.newPassword || "") as string;
  const confirmNewPassword = (formObject.confirmNewPassword || "") as string;

  if (newPassword !== confirmNewPassword) {
    return "Passwords do not match";
  }

  try {
    await setNewForgottenPassword(email, code, newPassword);
    return redirect("/signin");
  } catch (error: any) {
    const errorObj = error as { message: string };
    return errorObj.message;
  }
}

export default function ForgotPasswordConfirmation() {
  const error = useActionData() as string;
  const { email } = useLoaderData() as any;
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.title = `AuthProject | Reset Password`;

    const input = document.getElementById("email") as HTMLInputElement;
    input.value = email;

    if (error) {
      setPasswordError(error);
    }
  }, [email, error]);

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
          Password Reset Required
        </Typography>

        {passwordError ? (
          <Alert
            severity="error"
            sx={{ marginTop: "10px", marginBottom: "20px" }}
          >
            {" "}
            {passwordError}
          </Alert>
        ) : (
          <Alert
            severity="info"
            sx={{ marginTop: "10px", marginBottom: "20px" }}
          >
            We&apos;ve sent a unique code to your email address, please provide
            it below to verify your account.
          </Alert>
        )}

        <Typography component="h3" variant="body1"></Typography>
        <Box sx={{ mt: 1 }}>
          <Form method="post" id="confirm-reset-form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Password Reset Code (Check Email)"
              name="code"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="newPassword"
              type="password"
              label="New Password"
              name="newPassword"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmNewPassword"
              type="password"
              label="Confirm New Password"
              name="confirmNewPassword"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              RESET PASSWORD
            </Button>
          </Form>
        </Box>
      </Box>
    </Container>
  );
}
