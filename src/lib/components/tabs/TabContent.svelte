<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import type { SceneHandler } from '$lib/scene';
	import { getTabsContext, panelElementId, tabElementId } from './tabs-context';

	interface Props {
		children: Snippet;
		id: string;
		onenter?: SceneHandler;
		onexit?: SceneHandler;
	}

	let { children, id, onenter, onexit }: Props = $props();

	const tabs = getTabsContext();

	let rendered = $state(false);
	let panelEl: HTMLDivElement | undefined = $state();
	let generation = 0;

	const active = $derived(tabs.activeTab === id);

	$effect(() => {
		return tabs.registerPanel(id, {
			exit: async () => {
				const el = innerTarget(panelEl);
				const runId = ++generation;

				if (!el) {
					rendered = false;
					return;
				}

				await Promise.resolve(onexit?.(el)).catch(() => {});
				if (runId === generation) rendered = false;
			}
		});
	});

	$effect(() => {
		const isActive = active;
		const chromeReady = tabs.chromeReady;
		const leaving = tabs.leaving;

		if (isActive) {
			if (!chromeReady || leaving) return;

			const runId = ++generation;
			rendered = true;

			void tick().then(() => {
				if (runId !== generation) return;
				const el = innerTarget(panelEl);
				if (!el) return;
				void Promise.resolve(onenter?.(el));
			});
			return;
		}

		if (!rendered) return;

		const runId = ++generation;
		const el = innerTarget(panelEl);
		void Promise.resolve(el ? onexit?.(el) : undefined)
			.catch(() => {})
			.finally(() => {
				if (runId === generation) rendered = false;
			});
	});

	function innerTarget(panel: HTMLDivElement | undefined) {
		const child = panel?.firstElementChild;
		return child instanceof HTMLElement ? child : undefined;
	}
</script>

{#if rendered}
	<div
		bind:this={panelEl}
		id={panelElementId(tabs.controllerId, id)}
		role="tabpanel"
		aria-labelledby={tabElementId(tabs.controllerId, id)}
	>
		{@render children()}
	</div>
{/if}
