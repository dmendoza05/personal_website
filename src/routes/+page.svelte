<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import { getFeaturedProjects } from '$lib/data/projects';
	import { getLatestPosts } from '$lib/blog/posts';
	// import ProjectCard from '$lib/components/ProjectCard.svelte';
	import BlogPostCard from './(pages)/blog/_components/BlogPostCard.svelte';

	const featuredProjects = getFeaturedProjects();
	const latestPosts = getLatestPosts(3);
</script>

<svelte:head>
	<title>{site.name}</title>
	<meta name="description" content={site.description} />
</svelte:head>