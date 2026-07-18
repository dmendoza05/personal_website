<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getTabsContext, panelElementId, tabElementId } from './tabs-context';

	interface Props {
		children: Snippet;
		id: string;
		onenter?: () => void;
		onexit?: () => void;
	}

	let { children, id, onenter, onexit }: Props = $props();

	const tabs = getTabsContext();
	const active = $derived(tabs.activeTab === id);

	$effect(() => {
		if (!active) return;

		onenter?.();
		return () => onexit?.();
	});
</script>

{#if active}
	<div
		id={panelElementId(tabs.controllerId, id)}
		role="tabpanel"
		aria-labelledby={tabElementId(tabs.controllerId, id)}
	>
		{@render children()}
	</div>
{/if}
