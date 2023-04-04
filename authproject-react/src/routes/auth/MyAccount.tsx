import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    document.title = `AuthProject | My Account`;
  }, [location]);

  return (
    <Container
      disableGutters
      maxWidth="sm"
      component="main"
      sx={{ pt: 8, pb: 6 }}
    >
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        My Account
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        A placeholder for "My Account"
      </Typography>
    </Container>
  );
}
