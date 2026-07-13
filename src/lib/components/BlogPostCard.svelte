<script lang="ts">
	import type { BlogPostMeta } from '$lib/blog/types';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';

	let { post }: { post: BlogPostMeta } = $props();

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<article
	class="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md sm:p-6"
>
	<time class="text-sm text-muted" datetime={post.date}>{formatDate(post.date)}</time>
	<h2 class="mt-1 text-base font-semibold text-foreground sm:text-lg">
		<a href={resolve(`/blog/${post.slug}`)} class="hover:text-accent">{post.title}</a>
	</h2>
	<p class="mt-2 text-sm leading-relaxed text-muted">{post.description}</p>
	<a
		href={resolve(`/blog/${post.slug}`)}
		class="mt-3 inline-block text-sm font-medium text-accent hover:underline"
	>
		{m.blog_read_more()} →
	</a>
</article>
