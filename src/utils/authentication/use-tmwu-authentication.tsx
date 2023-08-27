import { useMsal } from "@azure/msal-react";
import { AuthenticationPermissionScopes } from "../../types/authentication/authentication-permission-scopes.enum";
import { AccountInfo, SilentRequest } from "@azure/msal-browser";

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

    // If there is an account, try to get the auth token
    if (result.account) {
      try {
        await acquireToken(result.account);
      } catch (e) {
        // If fail, keep going without token
      }
    }

    return result;
  };

  const logout = async () => {
    return await msalInstance.logout();
  };

  const acquireToken = async (
    account: AccountInfo,
    request?: Partial<SilentRequest>
  ) => {
    const accessTokenRequest = {
      scopes: ["user.read"],
      account: account,
    };
    return await msalInstance.acquireTokenSilent({
      ...accessTokenRequest,
      ...request,
    });
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
    acquireToken,
    getAllAccounts,
    getActiveAccount,
    setActiveAccount,
    getInactiveAccounts,
  };
};
