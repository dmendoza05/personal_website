import { parseFrontmatter } from './frontmatter';
import { markdownToHtml } from './markdown';
import type { BlogPost, BlogPostMeta } from './types';

const rawModules = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

function slugFromPath(path: string): string {
	return path.split('/').pop()!.replace(/\.md$/, '');
}

function parseMeta(path: string, raw: string): BlogPostMeta {
	const { data } = parseFrontmatter(raw);
	return {
		slug: slugFromPath(path),
		title: data.title ?? 'Untitled',
		date: data.date ?? '',
		description: data.description ?? ''
	};
}

export function getPosts(): BlogPostMeta[] {
	return Object.entries(rawModules)
		.map(([path, raw]) => parseMeta(path, raw as string))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLatestPosts(limit = 3): BlogPostMeta[] {
	return getPosts().slice(0, limit);
}

export function getPost(slug: string): BlogPost | null {
	const path = `/src/content/blog/${slug}.md`;
	const raw = rawModules[path] as string | undefined;
	if (!raw) return null;

	const { data, content } = parseFrontmatter(raw);
	return {
		slug,
		title: data.title ?? 'Untitled',
		date: data.date ?? '',
		description: data.description ?? '',
		html: markdownToHtml(content)
	};
}

export function getPostSlugs(): string[] {
	return getPosts().map((p) => p.slug);
}
