# 02 API & Server Boundaries

## 1. Scope & Edge Endpoints
All API endpoints execute as Next.js 15 Route Handlers under `src/app/api/`:

* `GET /api/ably/token`: Generates short-lived Ably client capabilities tokens without exposing the root master API key.
* `POST /api/chat`: AI chat assistant endpoint guarded by `chatIntentGate.ts` and `chatOutputGuard.ts`. Falls back to `deterministicResponder.ts` if LLM upstream fails or rate-limits.
* `GET /api/github-activity`: Aggregates recent public commits, pull requests, and push events.
* `GET /api/github-contributions`: Scrapes/serves GitHub contribution calendar matrix with fallback in `src/data/githubContributionsFallback.ts`.
* `GET /api/recommendations`: Serves peer recommendations and endorsements ledger.

---

## 2. Invariants & Security Contracts

1. **Ably Ephemeral Token Contract**:
   * Root `ABLY_API_KEY` is NEVER exposed to client bundles.
   * `route.ts` creates a restricted token request with capability `{ "*": ["subscribe", "publish", "presence"] }` and a 1-hour expiration.

2. **Chat Intent & Output Defense Invariants**:
   * Incoming messages pass through `chatIntentGate.ts` to block prompt injection, jailbreaks, and off-topic compute abuse.
   * AI responses pass through `chatOutputGuard.ts` to prevent data exfiltration, hallucinated claims, or breaking formatting constraints.
   * Zero Raw Errors: Upstream API errors cleanly return `{ response: string, source: "deterministic" }` rather than leaking upstream provider exceptions.
