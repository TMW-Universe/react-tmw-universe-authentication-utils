import { Account } from "@tmw-universe/tmw-universe-types";
import { useTmwuCredentials } from "./use-tmwu-credentials";

export function useTwmuAccount() {
  const account = useTmwuCredentials();

  return account;
}
