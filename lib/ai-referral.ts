/**
 * AI search / chat — human referrers + crawler split:
 * - Reference crawlers → CrawlerSeoPage + Allow:/
 * - Training crawlers → Disallow:/ (not on CrawlerSeoPage allowlist)
 * - Content-Signal preference: search=yes, ai-train=no, use=reference
 *
 * Step 5 research amendment: the kit omitted the three AI *search* crawlers
 * (OAI-SearchBot, Claude-SearchBot, Meta-WebIndexer) whose operators document
 * that blocking them removes the site from ChatGPT search / Claude search /
 * Meta AI citations respectively. Added. `meta-externalagent` stays in the
 * reference bucket per kit SoT (SEO_CRAWLER_RULES "In AI reference bucket"),
 * aligned with BOT_PATTERNS aiReference. `meta-externalfetcher` stays in
 * SOCIAL_PREVIEW_UA.
 */

/** robots.txt / HTTP preference (not a hard lock; pair with Disallow for training UAs). */
export const CONTENT_SIGNAL =
  "search=yes, ai-train=no, use=reference" as const

/** Training / model-ingest crawlers — block site-wide in robots.txt. */
export const AI_TRAINING_CRAWLER_AGENTS = [
  "Google-Extended",
  "Applebot-Extended",
  "GPTBot",
  "anthropic-ai",
  "ClaudeBot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "omgili",
] as const

export const AI_TRAINING_CRAWLER_UA =
  /google-extended|applebot-extended|gptbot|anthropic-ai|claudebot|bytespider|cohere-ai|diffbot|omgili/i

/**
 * User-triggered / citation crawlers — CrawlerSeoPage + Allow:/
 * (not model-training tokens).
 */
export const AI_REFERENCE_CRAWLER_AGENTS = [
  "ChatGPT-User",
  "OAI-SearchBot",
  "Claude-Web",
  "Claude-SearchBot",
  "PerplexityBot",
  "DuckAssistBot",
  "YouBot",
  "meta-webindexer",
  "meta-externalagent",
] as const

export const AI_REFERENCE_CRAWLER_UA =
  /chatgpt-user|oai-searchbot|claude-web|claude-searchbot|perplexitybot|duckassistbot|youbot|meta-webindexer|meta-externalagent/i

/** @deprecated Use AI_REFERENCE_CRAWLER_AGENTS — kept for older call sites during migrate. */
export const AI_REFERRAL_CRAWLER_AGENTS = AI_REFERENCE_CRAWLER_AGENTS

/** @deprecated Use AI_REFERENCE_CRAWLER_UA */
export const AI_REFERRAL_CRAWLER_UA = AI_REFERENCE_CRAWLER_UA

/** document.referrer hosts for human traffic from AI chat / search UIs. */
export const AI_REFERRAL_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "openai.com",
  "perplexity.ai",
  "claude.ai",
  "anthropic.com",
  "copilot.microsoft.com",
  "copilot.com",
  "gemini.google.com",
  "you.com",
  "poe.com",
  "phind.com",
  "meta.ai",
  "x.ai",
  "grok.com",
] as const
