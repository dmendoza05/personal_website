import { browser } from '$app/environment';
import {
	DEFAULT_PREFERENCES,
	PREFERENCES_STORAGE_KEY,
	isSectionDescriptionOpen,
	parsePreferences,
	serializePreferences,
	type Preferences
} from './schema';

let preferences = $state<Preferences>({
	sectionDescriptionsOpen: { ...DEFAULT_PREFERENCES.sectionDescriptionsOpen }
});
let hydrated = false;

function snapshot(): Preferences {
	return {
		sectionDescriptionsOpen: { ...preferences.sectionDescriptionsOpen }
	};
}

function readStorage(): Preferences {
	try {
		return parsePreferences(localStorage.getItem(PREFERENCES_STORAGE_KEY));
	} catch {
		return {
			sectionDescriptionsOpen: { ...DEFAULT_PREFERENCES.sectionDescriptionsOpen }
		};
	}
}

function writeStorage() {
	try {
		localStorage.setItem(PREFERENCES_STORAGE_KEY, serializePreferences(snapshot()));
	} catch {
		// Quota / private mode — keep in-memory state.
	}
}

function replacePreferences(next: Preferences) {
	preferences.sectionDescriptionsOpen = { ...next.sectionDescriptionsOpen };
	if (browser) writeStorage();
}

/** Reactive preferences snapshot. Read properties in templates for reactivity. */
export function getPreferences(): Preferences {
	return preferences;
}

export function setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): void {
	preferences[key] = value;
	if (browser) writeStorage();
}

export function updatePreferences(partial: Partial<Preferences>): void {
	if (partial.sectionDescriptionsOpen) {
		preferences.sectionDescriptionsOpen = {
			...preferences.sectionDescriptionsOpen,
			...partial.sectionDescriptionsOpen
		};
	}
	if (browser) writeStorage();
}

export function setSectionDescriptionOpen(sectionId: string, open: boolean): void {
	if (isSectionDescriptionOpen(preferences, sectionId) === open) return;
	preferences.sectionDescriptionsOpen[sectionId] = open;
	if (browser) writeStorage();
}

export function resetPreferences(): void {
	replacePreferences({
		sectionDescriptionsOpen: { ...DEFAULT_PREFERENCES.sectionDescriptionsOpen }
	});
}

/**
 * Hydrate from localStorage and keep tabs in sync via the `storage` event.
 * Call once from a root layout `onMount`; returns cleanup.
 */
export function initPreferences(): () => void {
	if (!browser) return () => {};

	if (!hydrated) {
		const stored = readStorage();
		preferences.sectionDescriptionsOpen = { ...stored.sectionDescriptionsOpen };
		hydrated = true;
	}

	function onStorage(event: StorageEvent) {
		if (event.key !== PREFERENCES_STORAGE_KEY) return;
		const stored = parsePreferences(event.newValue);
		preferences.sectionDescriptionsOpen = { ...stored.sectionDescriptionsOpen };
	}

	window.addEventListener('storage', onStorage);
	return () => window.removeEventListener('storage', onStorage);
}
