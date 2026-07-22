<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { site } from '$lib/data/site';
	import Page from '$lib/components/page/Page.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatCommentDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.post.title} | {site.name}</title>
	<meta name="description" content={data.post.description} />
</svelte:head>

<Page>
	<article>
		<a href={resolve('/blog')} class="text-sm text-accent hover:underline">← {m.blog_back()}</a>

		<header class="mt-4 mb-6 sm:mb-8">
			<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
				<time class="text-sm text-muted" datetime={data.post.date}>
					{formatDate(data.post.date)}
				</time>
				<span class="text-sm text-muted">{m.blog_views({ count: data.viewCount })}</span>
			</div>
			<h1 class="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
				{data.post.title}
			</h1>
			<p class="mt-2 text-sm text-muted sm:text-base">{data.post.description}</p>
		</header>

		<div class="prose prose-neutral dark:prose-invert prose-sm sm:prose-base max-w-none">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.post.html}
		</div>
	</article>

	<section
		class="mt-12 border-t border-border pt-8 sm:mt-16 sm:pt-10"
		aria-labelledby="comments-heading"
	>
		<h2 id="comments-heading" class="text-lg font-semibold text-foreground sm:text-xl">
			{m.blog_comments_title()}
		</h2>

		{#if data.comments.length === 0}
			<p class="mt-4 text-muted">{m.blog_comments_empty()}</p>
		{:else}
			<ul class="mt-6 space-y-6">
				{#each data.comments as comment (comment.id)}
					<li>
						<p class="text-sm font-medium text-foreground">{comment.authorName}</p>
						<time
							class="text-xs text-muted"
							datetime={new Date(comment.createdAt).toISOString()}
						>
							{formatCommentDate(comment.createdAt)}
						</time>
						<p class="mt-2 whitespace-pre-wrap text-foreground">{comment.body}</p>
					</li>
				{/each}
			</ul>
		{/if}

		{#if form?.success}
			<p class="mt-8 text-sm text-accent" role="status">{m.blog_comment_success()}</p>
		{/if}

		<form method="POST" action="?/comment" class="mt-8 space-y-4">
			<div class="absolute -left-[9999px]" aria-hidden="true">
				<label for="website">Website</label>
				<input id="website" type="text" name="website" tabindex="-1" autocomplete="off" />
			</div>

			<div>
				<label for="authorName" class="block text-sm font-medium text-foreground">
					{m.blog_comment_name()}
				</label>
				<input
					id="authorName"
					type="text"
					name="authorName"
					required
					maxlength="80"
					value={form?.values?.authorName ?? ''}
					class="mt-1 block w-full max-w-md rounded-md border border-border bg-background px-3 py-2.5 text-base text-foreground sm:py-2 sm:text-sm"
				/>
				{#if form?.fieldErrors?.authorName}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.fieldErrors.authorName}</p>
				{/if}
			</div>

			<div>
				<label for="body" class="block text-sm font-medium text-foreground">
					{m.blog_comment_body()}
				</label>
				<textarea
					id="body"
					name="body"
					required
					maxlength="2000"
					rows="4"
					class="mt-1 block w-full max-w-xl rounded-md border border-border bg-background px-3 py-2.5 text-base text-foreground sm:py-2 sm:text-sm"
				>{form?.values?.body ?? ''}</textarea>
				{#if form?.fieldErrors?.body}
					<p class="mt-1 text-sm text-red-600 dark:text-red-400">{form.fieldErrors.body}</p>
				{/if}
			</div>

			<button
				type="submit"
				class="inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 sm:w-auto sm:py-2"
			>
				{m.blog_comment_submit()}
			</button>
		</form>
	</section>
</Page>
