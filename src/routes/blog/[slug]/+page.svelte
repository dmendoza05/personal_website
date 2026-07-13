<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.post.title} | {site.name}</title>
	<meta name="description" content={data.post.description} />
</svelte:head>

<article>
	<a href={resolve('/blog')} class="text-sm text-accent hover:underline">← {m.blog_back()}</a>

	<header class="mt-4 mb-8">
		<time class="text-sm text-muted" datetime={data.post.date}>
			{formatDate(data.post.date)}
		</time>
		<h1 class="mt-1 text-3xl font-bold tracking-tight text-foreground">{data.post.title}</h1>
		<p class="mt-2 text-muted">{data.post.description}</p>
	</header>

	<div class="prose prose-neutral dark:prose-invert max-w-none">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html data.post.html}
	</div>
</article>
