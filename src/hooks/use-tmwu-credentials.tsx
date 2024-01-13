import { useTmwuCredentialsProvider } from "../providers/tmwu-credentials.provider";

export function useTmwuCredentials() {
  const { credentials, updateProfile } = useTmwuCredentialsProvider();

  const isAuthenticated = credentials !== null;

  if (isAuthenticated)
    return {
      isAuthenticated,
      account: credentials.account!,
      accessToken: credentials.accessToken,
      refetchUserAccount: async () => updateProfile({ forceRefetch: true }),
    } as const;

  return {
    isAuthenticated,
  } as const;
}
