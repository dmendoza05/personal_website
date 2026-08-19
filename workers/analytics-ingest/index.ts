import { ingestAnalytics } from '../../src/lib/server/analytics/ingest';

export interface Env {
	DATABASE_URL: string;
	CF_ANALYTICS_TOKEN: string;
	CF_ZONE_ID: string;
	ENVIRONMENT?: string;
}

type ScheduledController = {
	cron: string;
	scheduledTime: number;
};

const worker = {
	async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
		try {
			const result = await ingestAnalytics({
				databaseUrl: env.DATABASE_URL,
				token: env.CF_ANALYTICS_TOKEN,
				zoneId: env.CF_ZONE_ID
			});
			console.log('[analytics-ingest]', result);
		} catch (error) {
			console.error('[analytics-ingest] failed', {
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined
			});
			throw error;
		}
	},

	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname !== '/__scheduled') {
			return new Response('Not Found', { status: 404 });
		}

		if (env.ENVIRONMENT === 'production') {
			return new Response('Not Found', { status: 404 });
		}

		await worker.scheduled(
			{
				cron: url.searchParams.get('cron') ?? '0 6 * * *',
				scheduledTime: Date.now()
			},
			env
		);
		return new Response('ok');
	}
};

export default worker;
