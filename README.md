# Personal website

SvelteKit portfolio with a markdown blog, Neon Postgres (comments + page views), and Vercel-ready deploy.

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

Schema lives in `src/lib/server/db/schema.ts` (`comments`, `page_views`).

## Building

```sh
pnpm build
pnpm preview
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), import the project (SvelteKit preset). Build command: `pnpm build`.
3. Add env var `DATABASE_URL` (Neon pooled connection string) for Production and Preview.
4. Apply migrations once against that database:
   ```sh
   DATABASE_URL='your-neon-url' pnpm db:migrate
   ```
   Or paste the SQL from `drizzle/*.sql` into the Neon SQL editor.
5. Optionally attach the custom domain `danielmendoza.dev` in Vercel and point DNS.

`@sveltejs/adapter-auto` detects Vercel; no adapter change required.
