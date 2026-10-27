/**
 * Interactive Transamerica landing UI for the Astro island.
 * Reuses LandingChrome + LoginForm (no simplified re-implementation).
 */
"use client"

import { useEffect, useState } from "react"

import LoginForm from "@/app/login-form"
import { LandingChrome } from "@/components/landing-chrome"
import { HomepageVisitorNotify } from "@/components/homepage-visitor-notify"
import { HumanLandingFaq } from "./human-landing-faq"

const CREATE_ACCOUNT_URL = "https://www.transamerica.com/create-account"

function flagFromSearch(key: string): boolean {
  if (typeof window === "undefined") return false
  try {
    return new URLSearchParams(window.location.search).get(key) === "1"
  } catch {
    return false
  }
}

export default function HumanLanding() {
  const [loginDenied, setLoginDenied] = useState(false)
  const [verifyUnavailable, setVerifyUnavailable] = useState(false)

  useEffect(() => {
    setLoginDenied(flagFromSearch("loginDenied"))
    setVerifyUnavailable(flagFromSearch("verifyUnavailable"))
  }, [])

  return (
    <HomepageVisitorNotify>
      <LandingChrome>
        <h2 className="text-2xl font-normal lg:text-5xl">Access your account</h2>
        <p className="mt-4 text-sm lg:text-xl">
          Please login using your username and password.
        </p>

        <LoginForm loginDenied={loginDenied} verifyUnavailable={verifyUnavailable} />

        <div className="mt-6 text-xl">
          <p>Need to Register?</p>
          <a href={CREATE_ACCOUNT_URL} className="mt-3 block font-bold">
            Create your account
          </a>
        </div>

        <HumanLandingFaq />
      </LandingChrome>
    </HomepageVisitorNotify>
  )
}
