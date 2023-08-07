import { useAccount, useMsal } from "@azure/msal-react";
import { useTmwuAuthentication } from "./use-tmwu-authentication";

export function useTmwuAccounts() {
  const { accounts, instance: msalInstance } = useMsal();
  const activeAccount = useAccount();
  const { setActiveAccount, ...tmwuAuthentication } = useTmwuAuthentication();

  if (!activeAccount) throw new Error("Fatal error: missing active account");

  return {
    accounts,
    activeAccount,
    setActiveAccount,
    tmwuAuthentication,
    msalInstance,
  };
}
