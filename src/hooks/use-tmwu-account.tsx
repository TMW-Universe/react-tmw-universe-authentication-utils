import { useTmwuCredentialsProvider } from "../providers/tmwu-credentials.provider";

export function useTmwuAccount() {
  const { credentials } = useTmwuCredentialsProvider();

  const isAuthenticated = credentials !== null;

  if (isAuthenticated)
    return {
      isAuthenticated,
      account: credentials.account,
      accessToken: credentials.accessToken,
    } as const;

  return {
    isAuthenticated,
  } as const;
}
