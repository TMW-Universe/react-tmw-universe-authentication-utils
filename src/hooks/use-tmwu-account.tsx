import { useTmwuCredentials } from "./use-tmwu-credentials";

export function useTwmuAccount() {
  const account = useTmwuCredentials();

  // Not authenticated
  if (!account.isAuthenticated) throw new Error();

  return account;
}
