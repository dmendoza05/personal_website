<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy, onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import type { Timeline } from 'animejs';
	import type { SceneHandler } from '$lib/scene';
	import { setTabsContext, type TabPanelHandle } from './tabs-context';
	import { playTablistEnter, playTablistExit } from './tablist-scene';

	interface Props {
		children: Snippet;
		defaultTab: string;
		id?: string;
		label: string;
		/** Custom tablist enter. Defaults to staggered tabs, then the border. */
		onenter?: SceneHandler;
		/** Custom tablist exit. Defaults to reversing the border, then the tabs. */
		onexit?: SceneHandler;
		queryParam?: string;
		tabs: Snippet;
	}

	let {
		children,
		defaultTab,
		id = 'tabs',
		label,
		onenter,
		onexit,
		queryParam = 'tab',
		tabs
	}: Props = $props();

	let rootEl: HTMLDivElement | undefined = $state();
	let chromeReady = $state(false);
	let leaving = $state(false);
	let timeline: Timeline | undefined;
	let leavePromise: Promise<void> | undefined;
	const panels = new Map<string, TabPanelHandle>();

	onMount(() => {
		void playEnter();
	});

	onDestroy(() => {
		timeline?.pause();
	});

	onNavigate((navigation) => {
		const from = navigation.from?.url;
		const to = navigation.to?.url;
		if (!from || !to) return;
		if (from.pathname === to.pathname) return;

		return playLeave();
	});

	const activeTab = $derived(page.url.searchParams.get(queryParam) || defaultTab);

	setTabsContext({
		get activeTab() {
			return activeTab;
		},
		get chromeReady() {
			return chromeReady;
		},
		get controllerId() {
			return id;
		},
		get leaving() {
			return leaving;
		},
		hrefFor,
		registerPanel
	});

	function registerPanel(tabId: string, handle: TabPanelHandle) {
		panels.set(tabId, handle);
		return () => {
			if (panels.get(tabId) === handle) panels.delete(tabId);
		};
	}

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

	async function playEnter() {
		const root = rootEl;
		if (!root) {
			chromeReady = true;
			return;
		}

		timeline?.pause();

		if (onenter) {
			await Promise.resolve(onenter(root));
		} else {
			await playTablistEnter(root, (next) => {
				timeline = next;
			});
		}

		chromeReady = true;
	}

	function playLeave() {
		if (leavePromise) return leavePromise;

		leaving = true;
		leavePromise = (async () => {
			timeline?.pause();
			await panels.get(activeTab)?.exit();

			const root = rootEl;

			if (onexit) {
				await Promise.resolve(root ? onexit(root) : undefined);
				return;
			}

			if (root) {
				await playTablistExit(root, (next) => {
					timeline = next;
				});
			}
		})();

		return leavePromise;
	}
</script>

<div class="mb-6 sm:mb-8">
	<div bind:this={rootEl} class="relative">
		<div
			role="tablist"
			aria-label={label}
			tabindex="-1"
			class="flex gap-1"
			onkeydown={handleKeydown}
		>
			{@render tabs()}
		</div>
		<div
			data-tablist-border
			class="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-border motion-reduce:scale-x-100"
			aria-hidden="true"
		></div>
	</div>
</div>

{@render children()}
