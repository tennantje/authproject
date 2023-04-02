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
import {
  signIn,
  MFASetupRequiredError,
  MFACodeRequiredError,
  NewPasswordRequiredError,
} from "../../lib/auth/auth";
import SetupMFA from "./SetupMFA";
import { CognitoUser } from "@aws-amplify/auth";
import ProcessMFA from "./ProcessMFA";
import NewPasswordRequired from "./NewPasswordRequired";

export default function SignIn() {
  const [user, setUser] = useState<null | CognitoUser>(null);
  const [mfaSecret, setMFASecret] = useState("");
  const [showMFASetupFlow, setShowMFASetupFlow] = useState(false);
  const [showMFACodeRequiredFlow, setShowMFACodeRequiredFlow] = useState(false);
  const [showNewPWDRequiredFlow, setShowNewPWDRequiredFlow] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `AuthProject | Signin`;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = (data.get("email") as string) || "";
    const password = (data.get("password") as string) || "";

    try {
      await signIn(email, password);
    } catch (error: any) {
      if (error.name === "MFASetupRequiredError") {
        const mfaError = error as MFASetupRequiredError;
        setUser(mfaError.user);
        setMFASecret(mfaError.secret);
        setShowMFASetupFlow(true);
      } else if (error.name === "MFACodeRequiredError") {
        const mfaError = error as MFACodeRequiredError;
        setUser(mfaError.user);
        setShowMFACodeRequiredFlow(true);
      } else if (error.name === "NewPasswordRequiredError") {
        const mfaError = error as NewPasswordRequiredError;
        setUser(mfaError.user);
        setShowNewPWDRequiredFlow(true);
      } else if (error.name === "UserNotConfirmedException") {
        navigate(`/confirm-signup?email=${encodeURIComponent(email)}`);
      }
    }
  };

  if (showMFASetupFlow) {
    return <SetupMFA user={user} secret={mfaSecret} />;
  }
  if (showNewPWDRequiredFlow) {
    return <NewPasswordRequired user={user} />;
  }

  if (showMFACodeRequiredFlow) {
    return <ProcessMFA user={user} />;
  }

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
          Sign in
        </Typography>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
