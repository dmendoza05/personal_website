import { site } from '$lib/data/site';
import { getPostSlugs } from '$lib/blog/posts';
import { getProjectSlugs } from '$lib/data/projects';

const staticRoutes = ['', '/works', '/about', '/blog'];
const blogSlugs = getPostSlugs();
const projectSlugs = getProjectSlugs();

export function GET() {
	const urls = [
		...staticRoutes.map((path) => `${site.url}${path}`),
		...projectSlugs.map((slug) => `${site.url}/works/${slug}`),
		...blogSlugs.map((slug) => `${site.url}/blog/${slug}`)
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `  <url>
    <loc>${url}</loc>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}
