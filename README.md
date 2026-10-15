# Personal website

SvelteKit portfolio with a markdown blog, Neon Postgres (comments + page views), and Cloudflare-ready deploy.

## Developing

```sh
pnpm install
cp .env.example .env
# Set DATABASE_URL to your Neon pooled connection string
pnpm db:migrate
pnpm dev
```

## Database

Uses [Drizzle](https://orm.drizzle.team) + [Neon](https://neon.tech) Postgres.

| Script | Purpose |
|--------|---------|
| `pnpm db:generate` | Generate SQL migrations from the schema |
| `pnpm db:migrate` | Apply migrations to the database in `DATABASE_URL` |
| `pnpm db:studio` | Open Drizzle Studio |

Schema lives in `src/lib/server/db/schema.ts` (`comments`, `page_view_counts`, `page_view_daily`, `analytics_daily`, `analytics_rollups`, `analytics_dimensions`).

## Building

`pnpm build` applies pending Drizzle migrations (needs `DATABASE_URL`), then builds for Cloudflare Workers.

```sh
pnpm build
pnpm preview
```

## Deploy to Cloudflare

1. Push this repo to GitHub.
2. In [Cloudflare Workers & Pages](https://dash.cloudflare.com), create a Worker connected to the repo (or run `pnpm deploy` with Wrangler).
3. Build command: `pnpm build`. Build output / deploy uses `.svelte-kit/cloudflare` via `wrangler.jsonc`.
4. Add env var `DATABASE_URL` (Neon pooled connection string) for Production — required at **build** time so migrations can run, and at **runtime** for the app.
5. Attach the custom domain `danielmendoza.io` in Cloudflare (DNS is already on Cloudflare).

Uses `@sveltejs/adapter-cloudflare` with `nodejs_compat` and `nodejs_als`. Schema migrations run automatically as part of `pnpm build`.

### Analytics dashboard

The `/dashboard` page reads unique visitors, page visits, and the 7-day country and device breakdown from Neon via `/api/dashboard`. A separate ingest Worker, `personal-website-analytics-ingest`, snapshots Cloudflare GraphQL once a day (06:00 UTC) into `analytics_daily`, `analytics_rollups`, and `analytics_dimensions`. The site Worker does not call Cloudflare.

`pnpm deploy` publishes the site only. Ingest code under `src/lib/server/analytics/` and `workers/analytics-ingest/` goes live with `pnpm deploy:ingest`.

#### First-time setup

1. Create an API token with **Analytics → Read** for your zone.
2. Set secrets on the **ingest** Worker (do not commit them):

```sh
wrangler secret put DATABASE_URL --config workers/analytics-ingest/wrangler.jsonc
wrangler secret put CF_ANALYTICS_TOKEN --config workers/analytics-ingest/wrangler.jsonc
wrangler secret put CF_ZONE_ID --config workers/analytics-ingest/wrangler.jsonc
```

Use the Neon **pooled** (`-pooler`) connection string for `DATABASE_URL`. Each `secret put` deploys a new version. Set all three before relying on the cron.

3. Deploy the ingest Worker:

```sh
pnpm deploy:ingest
```

4. For a local run, copy `workers/analytics-ingest/.dev.vars.example` to `workers/analytics-ingest/.dev.vars` and fill in the same three values. Set `ENVIRONMENT=development` in that file. Production sets `ENVIRONMENT=production`, and the deployed Worker returns 404 for `/__scheduled`.

#### Redeploy after ingest changes

Run this from the repo root whenever ingest queries or the Worker entry change:

```sh
pnpm deploy:ingest
```

That uploads the Worker and keeps the cron at `0 6 * * *` (06:00 UTC). Secrets already on the Worker stay in place. Run `wrangler secret put` again only when `DATABASE_URL`, `CF_ANALYTICS_TOKEN`, or `CF_ZONE_ID` changes.

The next scheduled run refreshes daily totals and the 7-day country requests, country page views, and device rows. There is no older page-view or device history to backfill. To snapshot immediately instead of waiting for 06:00 UTC, start the local scheduled test and trigger it:

```sh
pnpm analytics:ingest
```

```sh
curl "http://localhost:8787/__scheduled?cron=0+6+*+*+*"
```

The local trigger uses `.dev.vars` and writes to the same Neon database as production. The curl returns `Ran scheduled event`. Stop the Wrangler process after the log shows `[analytics-ingest]` with `dimensionsStored: true`.
