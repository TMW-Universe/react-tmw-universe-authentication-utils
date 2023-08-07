import { useAccount, useMsal } from "@azure/msal-react";
import { useTmwuAuthentication } from "./use-tmwu-authentication";

export function useTmwuAccounts() {
  const { accounts, instance: msalInstance } = useMsal();
  const activeAccount = useAccount();
  const { setActiveAccount, getInactiveAccounts, ...tmwuAuthentication } =
    useTmwuAuthentication();

  if (!activeAccount) throw new Error("Fatal error: missing active account");

  const inactiveAccounts = getInactiveAccounts();

  return {
    accounts,
    activeAccount,
    setActiveAccount,
    inactiveAccounts,
    tmwuAuthentication,
    msalInstance,
  };
}
