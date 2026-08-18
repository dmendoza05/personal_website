import { boolean, date, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	postSlug: text('post_slug').notNull(),
	authorName: text('author_name').notNull(),
	body: text('body').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	approved: boolean('approved').default(true).notNull()
});

/** Fast lookup for “N views” badges — one row per path. */
export const pageViewCounts = pgTable('page_view_counts', {
	path: text('path').primaryKey(),
	viewCount: integer('view_count').notNull().default(0),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

/** Long-term timeseries you own — one row per path per UTC day. */
export const pageViewDaily = pgTable(
	'page_view_daily',
	{
		path: text('path').notNull(),
		day: date('day').notNull(),
		viewCount: integer('view_count').notNull().default(0)
	},
	(table) => [primaryKey({ columns: [table.path, table.day] })]
);

/** Cloudflare unique visitors + page visits — one row per UTC day. Never pruned. */
export const analyticsDaily = pgTable('analytics_daily', {
	day: date('day').primaryKey(),
	uniqueVisitors: integer('unique_visitors').notNull(),
	pageVisits: integer('page_visits').notNull(),
	fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull()
});

/** Preset unique-visitor totals computed by Cloudflare for a whole window. */
export const analyticsRollups = pgTable('analytics_rollups', {
	window: text('window').primaryKey(),
	startDay: date('start_day').notNull(),
	endDay: date('end_day').notNull(),
	uniqueVisitors: integer('unique_visitors').notNull(),
	fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull()
});

/** Snapshot of country / device breakdowns for a named window. */
export const analyticsDimensions = pgTable(
	'analytics_dimensions',
	{
		window: text('window').notNull(),
		kind: text('kind').notNull(),
		key: text('key').notNull(),
		value: integer('value').notNull(),
		fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [primaryKey({ columns: [table.window, table.kind, table.key] })]
);

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type PageViewCount = typeof pageViewCounts.$inferSelect;
export type PageViewDaily = typeof pageViewDaily.$inferSelect;
export type AnalyticsDaily = typeof analyticsDaily.$inferSelect;
export type AnalyticsRollup = typeof analyticsRollups.$inferSelect;
export type AnalyticsDimension = typeof analyticsDimensions.$inferSelect;
