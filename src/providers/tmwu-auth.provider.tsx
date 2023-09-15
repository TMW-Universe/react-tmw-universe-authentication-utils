import { addSeconds, format } from "date-fns";
import { createContext, useContext, useEffect } from "react";
import React from "react";
import AuthenticationRoute from "../components/authentication-route";
import { LoginOptions } from "../types/auth/login-options.type";
import TmwuCredentialsProvider from "./tmwu-credentials.provider";

export type TmwuAuthProviderType = TmwuAuthOptions & {
  loginOptions?: LoginOptions;
};

type TmwuAuthOptions = {
  authHost: string;
};

type Props = {
  options: TmwuAuthOptions;

  // JSX/TSX
  children: JSX.Element;
};

const TmwuAuthContext = createContext<TmwuAuthProviderType | null>(null);

export default function TmwuAuthProvider({ children, options }: Props) {
  const url = location.protocol + "//" + location.host + location.pathname;
  const isAuthenticationRoute =
    url ===
    location.protocol +
      "//" +
      window.location.host +
      "/_authentication/third-party-authenticate/v1";

  useEffect(() => {
    if (isAuthenticationRoute) {
      const params = new URLSearchParams(window.location.search);
      document.cookie = `transferAccessToken=${params.get(
        "accessToken"
      )}; expires=${format(
        addSeconds(new Date(), 30),
        "dd/MM/yyyy HH:mm:ss"
      )}; path=/`;
      window.close();
    }
  }, [isAuthenticationRoute]);

  return (
    <TmwuAuthContext.Provider value={options}>
      {isAuthenticationRoute ? (
        <AuthenticationRoute />
      ) : (
        <TmwuCredentialsProvider>{children}</TmwuCredentialsProvider>
      )}
    </TmwuAuthContext.Provider>
  );
}

export function useTmwuAuthProvider() {
  const context = useContext(TmwuAuthContext);

  if (!context) throw new Error("No Auth context");

  return context;
}
