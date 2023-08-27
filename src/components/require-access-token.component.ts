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

  useEffect(() => {
    if (activeAccount) acquireToken(activeAccount);
  }, [activeAccount]);

  if (!accessToken) return waitingForToken ?? null;

  return children;
}
