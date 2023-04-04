import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router-dom";

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
import ForgotPasswordConfirmation, {
  action as ForgotPasswordConfirmationAction,
  loader as ForgotPasswordConfirmationLoader,
} from "./routes/auth/ForgotPasswordConfirmation";
import PrivateRoutes from "./PrivateRoutes";
import MyAccount from "./routes/auth/MyAccount";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const userManagementRoutes: RouteObject[] = [
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
  {
    path: "forgot-password-confirmation",
    element: <ForgotPasswordConfirmation />,
    action: ForgotPasswordConfirmationAction,
    loader: ForgotPasswordConfirmationLoader,
  },
];
const privateRoutes: RouteObject[] = [
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "myaccount",
        element: <MyAccount />,
      },
    ],
  },
];

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
          ...userManagementRoutes,
          ...privateRoutes,
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
