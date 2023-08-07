import { useMsal } from "@azure/msal-react";
import { AuthenticationPermissionScopes } from "../../types/authentication/authentication-permission-scopes.enum";
import { AccountInfo } from "@azure/msal-browser";

type LoginOptions = {
  setActiveAccount?: boolean;
  scopes?: AuthenticationPermissionScopes[];
  redirectUri: string;
};

export const useTmwuAuthentication = () => {
  const { instance: msalInstance } = useMsal();

  const login = async ({
    setActiveAccount: doSetActiveAccount,
    scopes,
    redirectUri,
  }: LoginOptions) => {
    const result = await msalInstance.loginPopup({
      scopes: scopes ?? [AuthenticationPermissionScopes.USER_READ],
      redirectUri,
    });
    if (doSetActiveAccount !== false) setActiveAccount(result.account);
    return result;
  };

  const logout = async () => {
    return await msalInstance.logout();
  };

  const getAllAccounts = () => msalInstance.getAllAccounts();
  const getActiveAccount = () => msalInstance.getActiveAccount();
  const setActiveAccount = (account: AccountInfo | null) =>
    msalInstance.setActiveAccount(account);
  const getInactiveAccounts = () =>
    getAllAccounts().filter(
      (account) => account.homeAccountId !== getActiveAccount()?.homeAccountId
    );

  return {
    login,
    logout,
    getAllAccounts,
    getActiveAccount,
    setActiveAccount,
    getInactiveAccounts,
  };
};
