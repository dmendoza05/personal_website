# Review checklist

Flag bugs, data loss, and secret exposure. Skip style nits such as CSS property order, Svelte script order, and wording about DRY.

## Analytics ingest

Paths: `workers/analytics-ingest/index.ts`, `src/lib/server/analytics/ingest.ts`, `src/lib/server/analytics/ingest-query.ts`.

- Daily points, rollups, and dimensions must not drop days, double-count uniques, or store a rollup that disagrees with the daily series without failing the run.
- A failed Cloudflare or database write must fail the scheduled run. Do not swallow errors that leave Neon behind the zone.
- `DATABASE_URL`, `CF_ANALYTICS_TOKEN`, and `CF_ZONE_ID` must not appear in responses, logs, or client code.
- `GET /__scheduled` must stay unavailable when `ENVIRONMENT` is `production`.

## Writes from the site

- Blog comments (`src/routes/(pages)/blog/[slug]/+page.server.ts`, `src/lib/server/db/comments.ts`) must keep length limits, the honeypot, and the `approved` filter on public reads.
- Pageview and analytics queries must not leak rows or credentials to the client.
