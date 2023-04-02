import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Password } from "@mui/icons-material";

import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © AuthProject "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function SignedInContent({ username }: { username: string }) {
  const auth = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function handleSignout() {
    auth.signOut();
  }

  return (
    <>
      <p style={{ marginRight: "10px" }}>
        <b>Signed in as: </b> {username}{" "}
      </p>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt={username}
              src={`https://avatars.dicebear.com/api/bottts/${username}.svg`}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">My Account</Typography>
          </MenuItem>
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography onClick={handleSignout} textAlign="center">
              Signout
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

function SignedOutContent() {
  return (
    <>
      <Link component={RouterLink} to="/signup">
        <Button variant="contained" color="secondary" sx={{ my: 1, mx: 1.5 }}>
          Sign Up
        </Button>
      </Link>
      <Link component={RouterLink} to="/signin">
        <Button variant="contained" color="primary" sx={{ my: 1, mx: 1.5 }}>
          Sign In
        </Button>
      </Link>
    </>
  );
}

export default function Root() {
  const auth = useAuth();
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Password sx={{ marginRight: "5px" }} />
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link
              component={RouterLink}
              to="/"
              underline="none"
              color={"#222222"}
            >
              AuthProject
            </Link>
          </Typography>
          {auth.isAuthenticated ? (
            <SignedInContent username={auth.username} />
          ) : (
            <SignedOutContent />
          )}
        </Toolbar>
      </AppBar>

      <Outlet />

      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </React.Fragment>
  );
}
