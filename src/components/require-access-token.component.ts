import { useEffect } from "react";
import { useTmwuAccounts } from "../utils/authentication/use-tmwu-accounts";

type Props = {
  waitingForToken?: JSX.Element;
  children?: JSX.Element;
};

export function RequireAccessTokenComponent({
  waitingForToken,
  children,
}: Props) {
  const {
    activeAccount,
    tmwuAuthentication: { acquireToken },
    accessToken,
  } = useTmwuAccounts();

  const fetchToken = async () => {
    if (activeAccount) acquireToken(activeAccount);
  };

  useEffect(() => {
    fetchToken();
  }, [activeAccount]);

  useEffect(() => {
    fetchToken();
  }, []);

  if (!accessToken) return waitingForToken ?? null;

  return children;
}
