export {
	DEFAULT_PREFERENCES,
	DEFAULT_SECTION_DESCRIPTION_OPEN,
	PREFERENCES_STORAGE_KEY,
	isSectionDescriptionOpen,
	parsePreferences,
	serializePreferences,
	type Preferences
} from './schema';

export {
	getPreferences,
	initPreferences,
	resetPreferences,
	setPreference,
	setSectionDescriptionOpen,
	updatePreferences
} from './preferences.svelte';
