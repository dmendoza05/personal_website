import { getContext, setContext } from 'svelte';

interface TabsContext {
	readonly activeTab: string;
	readonly controllerId: string;
	hrefFor: (id: string) => string;
}

const TABS_CONTEXT = Symbol('tabs');

export function setTabsContext(context: TabsContext) {
	setContext(TABS_CONTEXT, context);
}

export function getTabsContext() {
	const context = getContext<TabsContext | undefined>(TABS_CONTEXT);

	if (!context) {
		throw new Error('Tab and TabContent must be children of TabsController');
	}

	return context;
}

export function tabElementId(controllerId: string, tabId: string) {
	return `${controllerId}-tab-${toDomId(tabId)}`;
}

export function panelElementId(controllerId: string, tabId: string) {
	return `${controllerId}-panel-${toDomId(tabId)}`;
}

function toDomId(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, '-');
}
