import React, { useEffect, useState } from "react";
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
import { handleForcedPasswordReset } from "../../lib/auth/auth";

export default function NewPasswordRequired({
  user,
}: {
  user: CognitoUser | null;
}) {
  const navigate = useNavigate();
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.title = `AuthProject | Setup MFA`;
  }, []);

  if (!user) {
    return <></>;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = data.get("newPassword") as string;
    const confirmNewPassword = data.get("confirmNewPassword") as string;

    if (newPassword !== confirmNewPassword) {
      setPasswordMismatch(true);
      return;
    }
    try {
      await handleForcedPasswordReset(user, newPassword);
    } catch (error: any) {
      setPasswordError(error.message);
    }
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
          Password Reset Required
        </Typography>

        {passwordMismatch ? (
          <Alert severity="error">Passwords do not match.</Alert>
        ) : (
          <></>
        )}

        {passwordError ? (
          <Alert severity="error">{passwordError}</Alert>
        ) : (
          <></>
        )}

        <Typography component="h3" variant="body1"></Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            type="password"
            label="New Password"
            name="newPassword"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmNewPassword"
            type="password"
            label="Confirm New Password"
            name="confirmNewPassword"
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            RESET PASSWORD
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
