import React, { useEffect, useState } from "react";
import { Form, useLoaderData, useActionData, redirect } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { confirmSignUp, resendConfirmationCode } from "../../lib/auth/auth";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  return { email };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const email = (formObject.email || "") as string;
  const token = (formObject.token || "") as string;
  try {
    await confirmSignUp(email, token);
    return redirect("/signin");
  } catch (error) {
    return error;
  }
}

export default function ConfirmSignup() {
  const [errorMessage, setErrorMessage] = useState("");
  const [disableCodeSend, setDisableCodeSend] = useState(false);
  const error = useActionData();
  const { email } = useLoaderData() as any;

  useEffect(() => {
    document.title = `AuthProject | Email Confirmation`;
    const input = document.getElementById("email") as HTMLInputElement;
    input.value = email;
    if (error) {
      const errorObj = error as { message: string };
      setErrorMessage(errorObj.message);
    }
  }, [email, error]);

  const handleResendMyCode = async () => {
    setDisableCodeSend(true);
    try {
      await resendConfirmationCode(email);
    } catch (error) {
      console.log(error);
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
          Email Confirmation
        </Typography>
        {errorMessage ? (
          <Alert severity="error" sx={{ marginBottom: "20px" }}>
            {errorMessage}
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
          <Form method="post" id="confirm-signup-form">
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
              id="token"
              label="Confirmation Code"
              name="token"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm my account
            </Button>
          </Form>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Button
            onClick={handleResendMyCode}
            type="submit"
            disabled={disableCodeSend}
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 3, mb: 2 }}
          >
            {disableCodeSend ? "CODE WAS SENT" : "SEND MY CODE AGAIN"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
