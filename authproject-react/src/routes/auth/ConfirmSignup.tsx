import React, { useEffect, useState } from "react";
import {
  Link,
  Form,
  useLocation,
  useLoaderData,
  redirect,
} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { confirmSignUp, resendConfirmationCode } from "../../lib/auth/auth";
import { authErrorMessages } from "@aws-amplify/auth/lib-esm/Errors";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  return { email };
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  const email = (formObject.email || "") as string;
  const token = (formObject.token || "") as string;
  await confirmSignUp(email, token);
  return redirect("/signin");
}

export default function ConfirmSignup() {
  const [disableCodeSend, setDisableCodeSend] = useState(false);
  const { email } = useLoaderData() as any;

  useEffect(() => {
    document.title = `AuthProject | Email Confirmation`;
    const input = document.getElementById("email") as HTMLInputElement;
    input.value = email;
  }, [email]);

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
        <hr />
        <Alert severity="info">
          We've sent a unique code to your email address, please provide it
          below to verify your account.
        </Alert>

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
