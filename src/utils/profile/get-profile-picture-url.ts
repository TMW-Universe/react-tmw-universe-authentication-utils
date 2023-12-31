import { Account } from "@tmw-universe/tmw-universe-types";
import md5 from "blueimp-md5";

export const getProfilePictureUrl = (
  account: Account,
  options?: { size?: number }
) =>
  `https://gravatar.com/avatar/${md5(account.email.trim().toLowerCase())}?s=${
    options?.size ?? 200
  }`;
