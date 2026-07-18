<script lang="ts">
	import { getTabsContext, panelElementId, tabElementId } from './tabs-context';

	interface Props {
		id?: string;
		label: string;
	}

	let { id, label }: Props = $props();

	const tabs = getTabsContext();
	const tabId = $derived(id || label);
	const active = $derived(tabs.activeTab === tabId);
</script>

<a
	href={tabs.hrefFor(tabId)}
	role="tab"
	aria-controls={panelElementId(tabs.controllerId, tabId)}
	aria-selected={active}
	id={tabElementId(tabs.controllerId, tabId)}
	tabindex={active ? 0 : -1}
	class="relative -mb-px border-b-2 px-3 py-2 text-2xl transition-colors uppercase tracking-normal rajdhani font-bold {active
		? 'border-accent text-accent'
		: 'border-transparent text-muted hover:text-foreground'}"
>
	{label}
</a>
