import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";

import { userPoolConfig } from "./lib/auth/config";
Auth.configure(userPoolConfig);

interface UseAuth {
  isLoading: boolean;
  isAuthenticated: boolean;
  username: string;
  jwtToken: string;
  signOut: () => void;
  addSessionToContext: (session: CognitoUser) => void;
}

type Props = {
  children?: React.ReactNode;
};

const authContext = createContext<UseAuth | null>(null);

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = (): UseAuth => {
  const auth = useContext(authContext);
  if (!auth) {
    throw new Error("useAuth must be used within a ProvideAuth component");
  }
  return auth;
};

const useProvideAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const result = await Auth.currentAuthenticatedUser();
        setUsername(result.username);
        setJwtToken(result.signInUserSession.idToken.jwtToken);
        setIsAuthenticated(true);
      } catch (error) {
        setUsername("");
        setJwtToken("");
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    checkAuthenticationStatus();
  }, [isAuthenticated]);

  const addSessionToContext = async (user: CognitoUser) => {
    const session = user.getSignInUserSession();
    if (!session) {
      return;
    }
    setUsername(user.getUsername());
    setJwtToken(session.getIdToken().getJwtToken());
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUsername("");
      setJwtToken("");
      setIsAuthenticated(false);
      return { success: true, message: "" };
    } catch (error) {
      return {
        success: false,
        message: "LOGOUT FAIL",
      };
    }
  };

  return {
    isLoading,
    isAuthenticated,
    username,
    jwtToken,
    signOut,
    addSessionToContext,
  };
};
