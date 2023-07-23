import { useMsal } from "@azure/msal-react";
import { AuthenticationPermissionScopes } from "../../../types/authentication/authentication-permission-scopes.enum";

type Options = {
  scopes?: AuthenticationPermissionScopes[];
  redirectUri: string;
};

export const useTmwuAuthentication = ({ scopes, redirectUri }: Options) => {
  const { instance: msalInstance } = useMsal();

  const login = async () => {
    const result = await msalInstance.loginPopup({
      scopes: scopes ?? [AuthenticationPermissionScopes.USER_READ],
      redirectUri,
    });
    return result;
  };

  const logout = async () => {
    return await msalInstance.logout();
  };

  const getAllAccounts = () => msalInstance.getAllAccounts();
  const getActiveAccount = () => msalInstance.getActiveAccount();

  return {
    login,
    logout,
    getAllAccounts,
    getActiveAccount,
  };
};
