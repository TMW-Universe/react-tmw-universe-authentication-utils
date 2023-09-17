import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { parseJwt } from "../utils/jwt/parse-jwt.util";
import axios from "axios";
import { useTmwuAuthProvider } from "./tmwu-auth.provider";
import { LOCAL_STORAGE_CONSTANTS } from "../constants/local-storage.constants";
import { Account, Credentials, Jwt } from "@tmw-universe/tmw-universe-types";

type Type = {
  setCredentials: (credentials: Credentials | null) => void;
  credentials: Credentials | null;
  updateProfile: () => Promise<void>;
  setAccessToken: (accessToken: string) => Promise<void>;
};

const TmwuCredentialsContext = createContext<Type | null>(null);

type Props = {
  children: JSX.Element;
};

export default function TmwuCredentialsProvider({ children }: Props) {
  const { authHost, onAccountChange } = useTmwuAuthProvider();

  // Read accessToken from storage
  const readCredentialsToken = () => {
    const accessToken = localStorage.getItem(
      LOCAL_STORAGE_CONSTANTS.accessToken
    );
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

      // Save profile into localStorage (cache profile)
      localStorage.setItem(
        LOCAL_STORAGE_CONSTANTS.profile,
        JSON.stringify(result.data)
      );

      // Update credentials
      setCredentials({
        ...(credentials ?? { accessToken }),
        account: result.data,
      });
    } catch (e) {
      // Fetching failed
      // Try to load cache info
      try {
        const profileItem = localStorage.getItem(
          LOCAL_STORAGE_CONSTANTS.profile
        );
        if (!profileItem) throw new Error("No profile cache");

        const account = JSON.parse(profileItem) as Account;

        // Set credentials using cache data
        setCredentials({
          ...(credentials ?? { accessToken }),
          account,
        });
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_CONSTANTS.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_CONSTANTS.profile);
        setCredentials(undefined);
      }
    }
  };

  // Credentials provider state
  const [credentials, setCredentialsState] = useState<
    Credentials | null | undefined
  >(undefined);

  const setCredentials = (creds: Credentials | null | undefined) => {
    if (onAccountChange) onAccountChange(creds?.account);
    setCredentialsState(creds);
  };

  // Update credentials on storage change event and on first load
  useEffect(() => {
    const storedCreds = readCredentialsToken();
    // If there is user signed in, fetch profile and set info into credentials provider
    if (storedCreds) getUserProfile(storedCreds.accessToken);
    // Else: no user is signed in, so set null credentials into credentials provider
    else setCredentials(null);
  }, []);

  // Try to update profile every time accessToken changes
  useEffect(() => {
    if (
      credentials?.accessToken &&
      credentials.accessToken !== readCredentialsToken()?.accessToken
    ) {
      getUserProfile(credentials.accessToken);
    }
  }, [credentials?.accessToken]);

  const setAccessToken = async (accessToken: string) => {
    await getUserProfile(accessToken);
  };

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
        setAccessToken,
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
