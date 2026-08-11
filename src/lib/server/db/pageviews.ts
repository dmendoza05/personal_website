import { and, eq, gte, lte, sql, sum } from 'drizzle-orm';
import { getDb } from './index';
import { pageViewCounts, pageViewDaily } from './schema';

function utcDayString(date = new Date()): string {
	return date.toISOString().slice(0, 10);
}

export async function recordPageView(path: string) {
	const db = getDb();
	const day = utcDayString();

	await db
		.insert(pageViewCounts)
		.values({ path, viewCount: 1 })
		.onConflictDoUpdate({
			target: pageViewCounts.path,
			set: {
				viewCount: sql`${pageViewCounts.viewCount} + 1`,
				updatedAt: sql`now()`
			}
		});

	await db
		.insert(pageViewDaily)
		.values({ path, day, viewCount: 1 })
		.onConflictDoUpdate({
			target: [pageViewDaily.path, pageViewDaily.day],
			set: {
				viewCount: sql`${pageViewDaily.viewCount} + 1`
			}
		});
}

export async function getPageViewCount(path: string) {
	const db = getDb();
	const [row] = await db
		.select({ value: pageViewCounts.viewCount })
		.from(pageViewCounts)
		.where(eq(pageViewCounts.path, path));
	return row?.value ?? 0;
}

/** Site-wide daily pageview totals between inclusive UTC dates (`YYYY-MM-DD`). */
export async function getDailyPageViewTotals(startDay: string, endDay: string) {
	const db = getDb();
	const rows = await db
		.select({
			day: pageViewDaily.day,
			pageViews: sum(pageViewDaily.viewCount).mapWith(Number)
		})
		.from(pageViewDaily)
		.where(and(gte(pageViewDaily.day, startDay), lte(pageViewDaily.day, endDay)))
		.groupBy(pageViewDaily.day)
		.orderBy(pageViewDaily.day);

	return rows.map((row) => ({
		day: String(row.day),
		pageViews: row.pageViews ?? 0
	}));
}
