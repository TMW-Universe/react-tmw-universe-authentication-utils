import { createContext, useContext, useEffect, useState } from "react";
import { Credentials } from "../types/credentials/credentials.type";
import React from "react";
import { parseJwt } from "../utils/jwt/parse-jwt.util";
import { Jwt } from "../types/credentials/jwt.type";

type Type = {
  setCredentials: (credentials: Credentials) => void;
  credentials: Credentials | null;
};

const TmwuCredentialsContext = createContext<Type | null>(null);

type Props = {
  children: JSX.Element;
};

export default function TmwuCredentialsProvider({ children }: Props) {
  const readCredentialsToken = () => {
    const accessToken = localStorage.getItem("tmwuAccessToken");
    if (!accessToken) return null;

    try {
      const token = parseJwt(accessToken) as Jwt;

      return {
        accessToken,
        account: {
          id: token.user.id,
          username: token.user.username,
          email: token.user.email,
          name: token.user.name,
          firstSurname: token.user.firstSurname,
          secondSurname: token.user.secondSurname,
        },
      } satisfies Credentials;
    } catch (e) {
      return null;
    }
  };

  const [credentials, setCredentials] = useState<Credentials | null>(
    readCredentialsToken()
  );

  useEffect(() => {
    addEventListener("storage", (e) => {
      if (e.key === "tmwuAccessToken") setCredentials(readCredentialsToken());
    });
  }, []);

  return (
    <TmwuCredentialsContext.Provider
      value={{ credentials: credentials ?? null, setCredentials }}
    >
      {children}
    </TmwuCredentialsContext.Provider>
  );
}

export function useTmwuCredentialsProvider() {
  const context = useContext(TmwuCredentialsContext);

  if (!context) throw new Error();

  return context;
}
