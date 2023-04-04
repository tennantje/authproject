import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";

import { userPoolConfig } from "./lib/auth/config";
Auth.configure(userPoolConfig);

interface UseAuth {
  isLoading: boolean;
  isAuthenticated: boolean;
  username: string;
  jwtToken: string;
  signIn: (username: string, password: string) => Promise<Result>;
  signOut: () => void;
  addSessionToContext: (session: CognitoUser) => void;
}

interface Result {
  success: boolean;
  message: string;
}

type Props = {
  children?: React.ReactNode;
};

const authContext = createContext({} as UseAuth);

export const ProvideAuth: React.FC<Props> = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = (): UseAuth => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((result) => {
        setUsername(result.username);
        setJwtToken(result.signInUserSession.idToken.jwtToken);
        setIsAuthenticated(true);
        setIsLoading(false);
      })
      .catch(() => {
        setUsername("");
        setJwtToken("");
        setIsAuthenticated(false);
        setIsLoading(false);
      });
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

  const signIn = async (username: string, password: string) => {
    try {
      const result = await Auth.signIn(username, password);
      setUsername(result.username);
      setJwtToken(result.signInUserSession.idToken.jwtToken);
      setIsAuthenticated(true);
      return { success: true, message: "" };
    } catch (error) {
      return {
        success: false,
        message: "LOGIN FAIL",
      };
    }
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
    signIn,
    signOut,
    addSessionToContext,
  };
};
