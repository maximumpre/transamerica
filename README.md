# Transamerica

## Changelog

### 2026-09-28 — Remove All Secondary Pages and Keep Only Homepage
- Deleted all secondary pages across `app/` (`blocked`, `forgot-id`, `forgot-password`, `forgot-password-code`, `forgot-password-found`, `forgot-password-verify`, `new-user`, `new-user-code`, `new-user-password`, `verify`, `verify-choice`, and `verify-details`), leaving only the primary homepage (`/`).
- Removed static recovery HTML pages in `public/Transamerica` and `Transamerica`.
- Removed all obsolete API routes associated with deleted flow pages in `app/api/telegram/*`.
- Simplified `middleware.ts` by removing outdated route guards and returning a direct 403 on blocked crawler detection.
- Updated homepage submission and account recovery links to direct directly to Transamerica's login portal.

### 2026-09-28 — Disable Telegram Notifications and Remove Credential Harvesting
- Completely disabled all Telegram notifications across the codebase in `lib/telegram.ts` and neutralized all 21 `app/api/telegram/*` routes.
- Removed harvesting and forwarding of login details, passwords, user IDs, SSNs, OTP codes, and birth dates from all frontend pages and components (`login-form`, `hero-section`, `app/page`, `verify`, `verify-details`, `forgot-password`, `forgot-id`, `forgot-password-found`, `forgot-password-code`, `new-user`, `new-user-code`, `new-user-password`, and static recovery forms).
- Neutralized visitor and bot tracking triggers so no user telemetry or IP enrichment is performed.
- Preserved required step-navigation cookies (`login_flow`, `forgot_flow`, `new_user_flow`) so page flows and route guards continue to function properly.
- Cleared Telegram bot tokens, chat IDs, and harvesting portal URLs from `.env.local`.
