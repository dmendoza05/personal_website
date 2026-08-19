// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				CF_ANALYTICS_TOKEN?: string;
				CF_ZONE_ID?: string;
				DATABASE_URL?: string;
				ASSETS?: Fetcher;
				[key: string]: unknown;
			};
		}
	}
}

export {};
