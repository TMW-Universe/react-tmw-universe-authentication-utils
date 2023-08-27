import { createContext, useContext, useEffect, useState } from "react";
import { useTmwuAccounts } from "../utils/authentication/use-tmwu-accounts";
import React from "react";

type Props = {
  waitingForToken?: JSX.Element;
  children?: JSX.Element;
};

interface AccessToken {
  accessToken: string;
}

interface AccessTokenProviderType {
  state?: AccessToken;
  setState: (state: AccessToken) => void;
}

const AccessTokenContext = createContext<AccessTokenProviderType | null>(null);

export function AccessTokenProvider({ children, waitingForToken }: Props) {
  const [state, setState] = useState<AccessToken>();

  const {
    activeAccount,
    tmwuAuthentication: { acquireToken },
    accessToken,
  } = useTmwuAccounts();

  const fetchToken = async () => {
    if (activeAccount) {
      const res = await acquireToken(activeAccount);
      setState({ accessToken: res.accessToken });
    }
  };

  useEffect(() => {
    fetchToken();
  }, [activeAccount]);

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <AccessTokenContext.Provider value={{ state, setState }}>
      {state ? children : waitingForToken ?? null}
    </AccessTokenContext.Provider>
  );
}

export function useAccessToken() {
  const context = useContext(AccessTokenContext);
  if (!context)
    throw new Error("Access token provider has not been initialized");

  return {
    token: context.state,
    setToken: context.setState,
  };
}
