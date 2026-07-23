<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick, untrack } from 'svelte';
	import {
		createSceneController,
		DEFAULT_SCENE_PRESET,
		type SceneHandler,
		type ScenePreset
	} from '$lib/scene';
	import { getTabsContext, panelElementId, tabElementId } from './tabs-context';

	interface Props {
		children: Snippet;
		id: string;
		/** Built-in animejs preset. Ignored when custom onenter/onexit are provided. */
		preset?: ScenePreset;
		onenter?: SceneHandler;
		onexit?: SceneHandler;
	}

	let {
		children,
		id,
		preset = DEFAULT_SCENE_PRESET,
		onenter,
		onexit
	}: Props = $props();

	const tabs = getTabsContext();
	const scene = createSceneController({
		get preset() {
			return preset;
		}
	});

	let rendered = $state(false);
	let panelEl: HTMLDivElement | undefined = $state();
	let generation = 0;
	/** Initially active tab is covered by the page scene; other tabs animate on first open. */
	let skipNextEnter = untrack(() => tabs.activeTab === id);

	const active = $derived(tabs.activeTab === id);

	$effect(() => {
		const isActive = active;
		const enter = onenter ?? ((el: HTMLElement) => scene.enter(el));
		const exit = onexit ?? ((el: HTMLElement) => scene.exit(el));

		if (isActive) {
			const runId = ++generation;
			rendered = true;

			void tick().then(() => {
				if (runId !== generation || !panelEl) return;
				if (skipNextEnter) {
					skipNextEnter = false;
					return;
				}
				void Promise.resolve(enter(panelEl));
			});
			return;
		}

		if (!rendered) return;

		skipNextEnter = false;
		const runId = ++generation;
		const el = panelEl;
		void Promise.resolve(el ? exit(el) : undefined)
			.catch(() => {})
			.finally(() => {
				if (runId === generation) rendered = false;
			});
	});
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
