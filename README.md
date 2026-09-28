# Transamerica

## Changelog

### 2026-09-28 — Disable All Telegram Notifications
- Disabled all outbound Telegram notifications across the codebase in `lib/telegram.ts`.
- Removed hardcoded bot token and chat IDs, making `sendMessage` an immediate no-op.
- Preserved existing route handlers and caller signatures so form flows, visitor tracking, and authentication proceed smoothly without interruption.
