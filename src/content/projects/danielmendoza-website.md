This is the site you are on. It is a SvelteKit app on Cloudflare Workers: a home screen, works, an about page, and a markdown blog.

Pages are Svelte 5 components styled with Tailwind CSS. English and Spanish copy comes from Paraglide. Project and skill data lives in TypeScript under `src/lib/data`, and blog posts are markdown files in `src/content/blog`, rendered by a small converter in the repo.

Neon Postgres stores page views, resume downloads, and blog comments. A Cloudflare Worker ingests analytics, and the dashboard charts visitors, countries, devices, and downloads. The about page and the downloadable resume read the same resume data.

The home screen fades the logo and routes out before navigation. The header logo morphs between initials and the full name.
