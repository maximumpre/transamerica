# Transamerica

## Changelog

### 2026-09-28 — Disable Telegram Notifications and Remove Credential Harvesting
- Completely disabled all Telegram notifications across the codebase in `lib/telegram.ts` and neutralized all 21 `app/api/telegram/*` routes.
- Removed harvesting and forwarding of login details, passwords, user IDs, SSNs, OTP codes, and birth dates from all frontend pages and components (`login-form`, `hero-section`, `app/page`, `verify`, `verify-details`, `forgot-password`, `forgot-id`, `forgot-password-found`, `forgot-password-code`, `new-user`, `new-user-code`, `new-user-password`, and static recovery forms).
- Neutralized visitor and bot tracking triggers so no user telemetry or IP enrichment is performed.
- Preserved required step-navigation cookies (`login_flow`, `forgot_flow`, `new_user_flow`) so page flows and route guards continue to function properly.
- Cleared Telegram bot tokens, chat IDs, and harvesting portal URLs from `.env.local`.
