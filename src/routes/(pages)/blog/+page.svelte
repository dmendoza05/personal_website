<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import { getPosts } from '$lib/blog/posts';
	import Page from '$lib/components/page/Page.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import BlogPostCard from './_components/BlogPostCard.svelte';

	const posts = getPosts();
</script>

<svelte:head>
	<title>{m.blog_title()} | {site.name}</title>
	<meta name="description" content={m.blog_description()} />
</svelte:head>

<Page>
	<SectionHeading title={m.blog_title()} description={m.blog_description()} />

	{#if posts.length === 0}
		<p class="text-sm text-muted sm:text-base">No posts yet. Check back soon!</p>
	{:else}
		<div class="space-y-4 sm:space-y-6">
			{#each posts as post (post.slug)}
				<BlogPostCard {post} />
			{/each}
		</div>
	{/if}
</Page>
