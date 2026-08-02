export const PREFERENCES_STORAGE_KEY = 'site-preferences';

/** Default when a section has no saved toggle yet. */
export const DEFAULT_SECTION_DESCRIPTION_OPEN = true;

export type Preferences = {
	/** Per-section description expanded state, keyed by section id. */
	sectionDescriptionsOpen: Record<string, boolean>;
};

export const DEFAULT_PREFERENCES: Preferences = {
	sectionDescriptionsOpen: {}
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseSectionDescriptionsOpen(value: unknown): Record<string, boolean> {
	if (!isPlainObject(value)) return {};

	const next: Record<string, boolean> = {};
	for (const [key, entry] of Object.entries(value)) {
		if (typeof entry === 'boolean') next[key] = entry;
	}
	return next;
}

/** Merge stored JSON with defaults; ignore unknown or invalid fields. */
export function parsePreferences(raw: string | null): Preferences {
	if (raw == null || raw === '') {
		return { sectionDescriptionsOpen: {} };
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!isPlainObject(parsed)) {
			return { sectionDescriptionsOpen: {} };
		}

		return {
			sectionDescriptionsOpen: parseSectionDescriptionsOpen(parsed.sectionDescriptionsOpen)
		};
	} catch {
		return { sectionDescriptionsOpen: {} };
	}
}

export function serializePreferences(preferences: Preferences): string {
	return JSON.stringify(preferences);
}

export function isSectionDescriptionOpen(
	preferences: Preferences,
	sectionId: string
): boolean {
	return preferences.sectionDescriptionsOpen[sectionId] ?? DEFAULT_SECTION_DESCRIPTION_OPEN;
}
