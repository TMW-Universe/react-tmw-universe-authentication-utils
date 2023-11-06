import { Account } from "@tmw-universe/tmw-universe-types";

export const getFullName = (account: Account) =>
  [account.name, account.firstSurname, account.secondSurname].join(" ");
