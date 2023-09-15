import { createContext, useContext, useEffect, useState } from "react";
import { Credentials } from "../types/credentials/credentials.type";
import React from "react";
import { parseJwt } from "../utils/jwt/parse-jwt.util";
import { Jwt } from "../types/credentials/jwt.type";
import axios from "axios";
import { useTmwuAuthProvider } from "./tmwu-auth.provider";
import { Account } from "../models/account/account.model";

type Type = {
  setCredentials: (credentials: Credentials) => void;
  credentials: Credentials | null;
  updateProfile: () => Promise<void>;
};

const TmwuCredentialsContext = createContext<Type | null>(null);

type Props = {
  children: JSX.Element;
};

export default function TmwuCredentialsProvider({ children }: Props) {
  const { authHost } = useTmwuAuthProvider();

  // Read accessToken from storage
  const readCredentialsToken = () => {
    const accessToken = localStorage.getItem("tmwuAccessToken");
    if (!accessToken) return null;

    try {
      return {
        accessToken,
      } satisfies Credentials;
    } catch (e) {
      return null;
    }
  };

  // Fetch user profile info
  const getUserProfile = async (accessToken: string) => {
    const token = parseJwt<Jwt>(accessToken);

    if (credentials?.account?.id === token.userId) return;
    try {
      const result = await axios.get<Account>(`${authHost}/api/users/profile`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });

      // Update credentials
      setCredentials({
        ...(credentials ?? { accessToken }),
        account: result.data,
      });
    } catch (e) {
      // Fetching failed
      setCredentials(undefined);
    }
  };

  // Credentials provider state
  const [credentials, setCredentials] = useState<
    Credentials | null | undefined
  >(undefined);

  // Update credentials on storage change event and on first load
  useEffect(() => {
    const storedCreds = readCredentialsToken();
    // If there is user signed in, fetch profile and set info into credentials provider
    if (storedCreds) getUserProfile(storedCreds.accessToken);
    // Else: no user is signed in, so set null credentials into credentials provider
    else setCredentials(null);

    addEventListener("storage", (e) => {
      if (e.key === "tmwuAccessToken") {
        const token = readCredentialsToken();
        if (token) {
          getUserProfile(token.accessToken);
        }
      }
    });
  }, []);

  // Try to update profile every time accessToken changes
  useEffect(() => {
    if (credentials?.accessToken) {
      getUserProfile(credentials.accessToken);
    }
  }, [credentials?.accessToken]);

  // If credentials is undefined, it means the library is fetching user profile (if there is signed in user)
  if (credentials === undefined) return null;

  return (
    <TmwuCredentialsContext.Provider
      value={{
        credentials,
        setCredentials,
        updateProfile: async () => {
          if (credentials?.accessToken)
            await getUserProfile(credentials.accessToken);
        },
      }}
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
