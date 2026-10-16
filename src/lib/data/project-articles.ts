import { parseFrontmatter } from '$lib/blog/frontmatter';
import { markdownToHtml } from '$lib/blog/markdown';

const rawModules = import.meta.glob('/src/content/projects/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

export function getProjectArticle(slug: string): string | null {
	const raw = rawModules[`/src/content/projects/${slug}.md`] as string | undefined;
	if (!raw?.trim()) return null;

	const html = markdownToHtml(parseFrontmatter(raw).content.trim());
	return html.trim() ? html : null;
}
