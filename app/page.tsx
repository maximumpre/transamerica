import { LandingChrome } from "@/components/landing-chrome";
import { HomepageVisitorNotify } from "@/components/homepage-visitor-notify";
import LoginForm from "@/app/login-form";

const CREATE_ACCOUNT_URL = "https://www.transamerica.com/create-account";

type SearchParams = Record<string, string | string[] | undefined>;

function flag(value: string | string[] | undefined): boolean {
  return Array.isArray(value) ? value[0] === "1" : value === "1";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};

  return (
    <HomepageVisitorNotify>
      <LandingChrome>
        <h2 className="text-2xl font-normal lg:text-5xl">Access your account</h2>
      <p className="mt-4 text-sm lg:text-xl">
        Please login using your username and password.
      </p>

      <LoginForm
        loginDenied={flag(params.loginDenied)}
        verifyUnavailable={flag(params.verifyUnavailable)}
      />

      <div className="mt-6 text-xl">
        <p>Need to Register?</p>
        <a href={CREATE_ACCOUNT_URL} className="mt-3 block font-bold">
          Create your account
        </a>
      </div>
      </LandingChrome>
    </HomepageVisitorNotify>
  );
}
