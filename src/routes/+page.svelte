<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import { getFeaturedProjects } from '$lib/data/projects';
	import { getLatestPosts } from '$lib/blog/posts';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import BlogPostCard from '$lib/components/BlogPostCard.svelte';

	const featuredProjects = getFeaturedProjects();
	const latestPosts = getLatestPosts(3);
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<section class="mb-12 sm:mb-16">
	<div class="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
		<h2 class="text-xl font-semibold text-foreground sm:text-2xl">{m.home_featured_projects()}</h2>
		<a href={resolve('/projects')} class="text-sm font-medium text-accent hover:underline">
			{m.home_view_all_projects()} →
		</a>
	</div>
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
		{#each featuredProjects as project (project.slug)}
			<ProjectCard {project} />
		{/each}
	</div>
</section>

<section>
	<div class="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
		<h2 class="text-xl font-semibold text-foreground sm:text-2xl">{m.home_latest_posts()}</h2>
		<a href={resolve('/blog')} class="text-sm font-medium text-accent hover:underline">
			{m.home_view_all_posts()} →
		</a>
	</div>
	{#if latestPosts.length === 0}
		<p class="text-sm text-muted sm:text-base">No posts yet. Check back soon!</p>
	{:else}
		<div class="space-y-4 sm:space-y-6">
			{#each latestPosts as post (post.slug)}
				<BlogPostCard {post} />
			{/each}
		</div>
	{/if}
</section>
