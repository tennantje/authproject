import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function PrivateRoutes() {
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading) {
      setIsAuthCheckComplete(true);
    }
  }, [auth.isLoading]);

  if (!isAuthCheckComplete) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
}
