import { AES, enc } from "crypto-js";
import { useTmwuAuthProvider } from "../providers/tmwu-auth.provider";
import { LoginOptions } from "../types/auth/login-options.type";
import { useState } from "react";
import { useTmwuCredentialsProvider } from "../providers/tmwu-credentials.provider";

export function useTmwuAuthentication() {
  const { authClient, loginOptions } = useTmwuAuthProvider();
  const { setAccessToken, setCredentials } = useTmwuCredentialsProvider();

  const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);

  function generateKey(length: number) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const hexToString = (hex: string) => {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const hexValue = hex.substr(i, 2);
      const decimalValue = parseInt(hexValue, 16);
      str += String.fromCharCode(decimalValue);
    }
    return str;
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  const login = async (options?: LoginOptions) => {
    if (isAuthPopupOpen) return;
    setAuthPopupOpen(true);
    const key = generateKey(128);
    const url = `${authClient}/third-party/authenticate/v1/${window.location.host}?encKey=${key}`;
    const authPopup =
      (loginOptions?.mode ?? options?.mode) === "newtab"
        ? window.open(url, "_blank")
        : window.open(
            url,
            "Popup",
            "toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=600,height=800,left=800,top=500"
          );

    const res = await new Promise<string | null>((resolve) => {
      const interval = setInterval(() => {
        try {
          if (!authPopup?.closed) return;
          clearInterval(interval);

          const rawToken = getCookie("transferAccessToken");
          if (!rawToken) {
            resolve(null);
          } else {
            const token = AES.decrypt(hexToString(rawToken), key).toString(
              enc.Utf8
            );
            localStorage.setItem("tmwuAccessToken", token);
            resolve(token);
          }
        } catch (e) {
          clearInterval(interval);
          resolve(null);
        }
      }, 500);
    });

    // Update provider accessToken
    if (res) await setAccessToken(res);

    setAuthPopupOpen(false);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("tmwuAccessToken");
    setCredentials(null);
  };

  return {
    login,
    logout,
    isAuthenticating: isAuthPopupOpen,
  };
}
