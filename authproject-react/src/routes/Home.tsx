import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    document.title = `AuthProject | Home`;
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
        AuthProject
      </Typography>
      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        A demo that adds Amazon Cognito to React.
      </Typography>
    </Container>
  );
}
