import { Account } from "@tmw-universe/tmw-universe-types";
import { useTmwuCredentials } from "./use-tmwu-credentials";

export function useTwmuAccount() {
  const account = useTmwuCredentials();

  // Not authenticated
  if (!account.isAuthenticated || !account.account) throw new Error();

  return account as {
    isAuthenticated: true;
    account: Account;
    accessToken: string;
  };
}
