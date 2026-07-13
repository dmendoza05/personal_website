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
	<h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
		{m.home_hero_title()}
	</h1>
	<p class="mt-3 text-lg text-muted sm:text-xl">{m.home_hero_tagline()}</p>
	<p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">
		{m.home_bio()}
	</p>
	<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
		<a
			href={resolve('/resume')}
			class="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:py-2"
		>
			{m.home_view_resume()}
		</a>
		<a
			href={site.links.github}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card sm:py-2"
		>
			GitHub
		</a>
	</div>
</section>

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
