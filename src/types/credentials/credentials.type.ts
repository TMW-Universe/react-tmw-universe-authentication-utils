import { Account } from "../../models/account/account.model";

export type Credentials = {
  accessToken: string;
  account: Account;
};
