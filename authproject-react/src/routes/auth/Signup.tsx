import React, { useEffect, useState } from "react";
import { Link, Form, redirect, useActionData } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { signUp } from "../../lib/auth/auth";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const email = (formObject.email || "") as string;
  const password = (formObject.password || "") as string;
  try {
    await signUp(email, password);
    return redirect(`/confirm-signup?email=${encodeURIComponent(email)}`);
  } catch (error) {
    return error;
  }
}

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState("");
  const error = useActionData();

  useEffect(() => {
    document.title = `AuthProject | Signup`;
    if (error) {
      const errorObj = error as { message: string };
      setErrorMessage(errorObj.message);
    }
  }, [error]);

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
          Sign up
        </Typography>
        <Box sx={{ mt: 3 }}>
          {errorMessage ? (
            <Alert severity="error" sx={{ marginBottom: "20px" }}>
              {errorMessage}
            </Alert>
          ) : (
            <></>
          )}
          <Form method="post" id="signup-form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Form>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
