<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { setTabsContext } from './tabs-context';

	interface Props {
		children: Snippet;
		defaultTab: string;
		id?: string;
		label: string;
		queryParam?: string;
		tabs: Snippet;
	}

	let { children, defaultTab, id = 'tabs', label, queryParam = 'tab', tabs }: Props = $props();

	const activeTab = $derived(page.url.searchParams.get(queryParam) || defaultTab);

	setTabsContext({
		get activeTab() {
			return activeTab;
		},
		get controllerId() {
			return id;
		},
		hrefFor
	});

	function hrefFor(tabId: string) {
		const searchParams = new URLSearchParams(page.url.searchParams);
		searchParams.set(queryParam, tabId);

		return `${page.url.pathname}?${searchParams.toString()}${page.url.hash}`;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

		const tabList = event.currentTarget as HTMLElement;
		const tabElements = Array.from(tabList.querySelectorAll<HTMLElement>('[role="tab"]'));
		const currentIndex = tabElements.indexOf(document.activeElement as HTMLElement);

		if (currentIndex === -1) return;

		event.preventDefault();

		const lastIndex = tabElements.length - 1;
		let nextIndex = currentIndex;

		if (event.key === 'ArrowLeft') nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
		if (event.key === 'ArrowRight') nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
		if (event.key === 'Home') nextIndex = 0;
		if (event.key === 'End') nextIndex = lastIndex;

		tabElements[nextIndex]?.click();
		tabElements[nextIndex]?.focus();
	}
</script>

<div class="mb-6 sm:mb-8">
	<div
		role="tablist"
		aria-label={label}
		tabindex="-1"
		class="flex gap-1 border-b border-border"
		onkeydown={handleKeydown}
	>
		{@render tabs()}
	</div>
</div>

{@render children()}
