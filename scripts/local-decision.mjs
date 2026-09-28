#!/usr/bin/env node
/**
 * Local QA helper — flip a pending-login status directly in Neon.
 *
 * The member site NEVER writes `pending_logins.status`: in production the admin
 * portal / Control Center PATCHes that column and the Gate 1 / Gate 2 poll
 * reads it back (see kit instruction.md §"Admin approval"). This script exists
 * only so the two-gate flow can be exercised locally without a Control Center.
 *
 * Usage:
 *   node scripts/local-decision.mjs <pending-id> approve|deny|redirect
 *
 * Reads DATABASE_URL from .env.local. Do not run against a shared/production
 * database without intending to.
 */
import fs from "node:fs"
import path from "node:path"
import { neon } from "@neondatabase/serverless"

const [id, action] = process.argv.slice(2)
if (!id || !["approve", "deny", "redirect"].includes(action)) {
  console.error("Usage: node scripts/local-decision.mjs <pending-id> approve|deny|redirect")
  process.exit(1)
}

const status = action === "approve" ? "approved" : action === "deny" ? "denied" : "redirected"

const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.error("No .env.local found — DATABASE_URL is required.")
  process.exit(1)
}
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=")
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()]
    }),
)

const sql = neon(env.DATABASE_URL)
const rows = await sql`
  UPDATE pending_logins
  SET status = ${status}
  WHERE id = ${id} AND status = 'pending'
  RETURNING id, status, method
`
if (rows.length === 0) {
  const existing = await sql`SELECT id, status FROM pending_logins WHERE id = ${id}`
  if (existing.length === 0) {
    console.error(`No pending row with id ${id}`)
    process.exit(1)
  }
  console.log(`Row ${id} is already '${existing[0].status}' — no change.`)
  process.exit(0)
}
console.log(`Row ${rows[0].id} → ${rows[0].status} (${rows[0].method})`)
process.exit(0)
