import { createTheme } from "@mui/material/styles";

// https://coolors.co/eaebed-0fa3b1-ff9b42-1e212b-94778b
// --antiflash-white: #eaebed;
// --moonstone: #0fa3b1;
// --sandy-brown: #ff9b42;
// --raisin-black: #1e212b;
// --mountbatten-pink: #94778b;

const theme = createTheme({
  palette: {
    primary: {
      main: "#0fa3b1",
    },
    secondary: {
      main: "#ff9b42",
    },
    text: {
      primary: "#1e212b",
      secondary: "#94778b",
    },
    background: {
      default: "#eaebed",
    },
  },
});

export default theme;
