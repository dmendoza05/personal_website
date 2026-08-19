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

Schema lives in `src/lib/server/db/schema.ts` (`comments`, `page_view_counts`, `page_view_daily`, `analytics_daily`, `analytics_rollups`).

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

### Analytics dashboard

The `/dashboard` page reads unique visitors and page visits from Neon via `/api/dashboard`. A separate ingest Worker snapshots Cloudflare GraphQL once a day (06:00 UTC) into `analytics_daily` and `analytics_rollups`. The site Worker does not call Cloudflare.

1. Create an API token with **Analytics → Read** for your zone.
2. Set secrets on the **ingest** Worker (do not commit them):

```sh
wrangler secret put DATABASE_URL --config workers/analytics-ingest/wrangler.jsonc
wrangler secret put CF_ANALYTICS_TOKEN --config workers/analytics-ingest/wrangler.jsonc
wrangler secret put CF_ZONE_ID --config workers/analytics-ingest/wrangler.jsonc
```

Use the Neon **pooled** (`-pooler`) connection string for `DATABASE_URL`.

3. Deploy the ingest Worker: `pnpm deploy:ingest`.
4. Local test: copy `workers/analytics-ingest/.dev.vars.example` to `workers/analytics-ingest/.dev.vars`, then:

```sh
pnpm analytics:ingest
# in another terminal (wrangler --test-scheduled):
curl "http://localhost:8787/__scheduled?cron=0+6+*+*+*"
```

Uses `@sveltejs/adapter-cloudflare` with `nodejs_compat` and `nodejs_als`. Schema migrations run automatically as part of `pnpm build`.
