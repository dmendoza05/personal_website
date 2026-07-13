import { count, eq } from 'drizzle-orm';
import { getDb } from './index';
import { pageViews } from './schema';

export async function recordPageView(path: string) {
	const db = getDb();
	await db.insert(pageViews).values({ path });
}

export async function getPageViewCount(path: string) {
	const db = getDb();
	const [row] = await db
		.select({ value: count() })
		.from(pageViews)
		.where(eq(pageViews.path, path));
	return row?.value ?? 0;
}
