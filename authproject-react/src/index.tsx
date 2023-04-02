import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import theme from "./Theme";
import Root from "./Root";
import ErrorPage from "./ErrorPage";
import Home from "./routes/Home";
import Signin from "./routes/auth/Signin";
import Signup, { action as SignupAction } from "./routes/auth/Signup";
import ConfirmSignup, {
  action as ConfirmSignupAction,
  loader as ConfirmSignupLoader,
} from "./routes/auth/ConfirmSignup";
import ForgotPassword from "./routes/auth/ForgotPassword";
import { ProvideAuth } from "./AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "signin",
            element: <Signin />,
          },
          {
            path: "signup",
            element: <Signup />,
            action: SignupAction,
          },
          {
            path: "confirm-signup",
            element: <ConfirmSignup />,
            action: ConfirmSignupAction,
            loader: ConfirmSignupLoader,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <ProvideAuth>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ProvideAuth>
  </React.StrictMode>
);
