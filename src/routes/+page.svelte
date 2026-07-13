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

<section class="mb-16">
	<h1 class="text-4xl font-bold tracking-tight text-foreground">{m.home_hero_title()}</h1>
	<p class="mt-3 text-xl text-muted">{m.home_hero_tagline()}</p>
	<p class="mt-6 max-w-2xl leading-relaxed text-muted">{m.home_bio()}</p>
	<div class="mt-6 flex flex-wrap gap-4">
		<a
			href={resolve('/resume')}
			class="inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
		>
			{m.home_view_resume()}
		</a>
		<a
			href={site.links.github}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card"
		>
			GitHub
		</a>
	</div>
</section>

<section class="mb-16">
	<div class="mb-6 flex items-baseline justify-between">
		<h2 class="text-2xl font-semibold text-foreground">{m.home_featured_projects()}</h2>
		<a href={resolve('/projects')} class="text-sm font-medium text-accent hover:underline">
			{m.home_view_all_projects()} →
		</a>
	</div>
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each featuredProjects as project (project.slug)}
			<ProjectCard {project} />
		{/each}
	</div>
</section>

<section>
	<div class="mb-6 flex items-baseline justify-between">
		<h2 class="text-2xl font-semibold text-foreground">{m.home_latest_posts()}</h2>
		<a href={resolve('/blog')} class="text-sm font-medium text-accent hover:underline">
			{m.home_view_all_posts()} →
		</a>
	</div>
	{#if latestPosts.length === 0}
		<p class="text-muted">No posts yet. Check back soon!</p>
	{:else}
		<div class="space-y-6">
			{#each latestPosts as post (post.slug)}
				<BlogPostCard {post} />
			{/each}
		</div>
	{/if}
</section>
