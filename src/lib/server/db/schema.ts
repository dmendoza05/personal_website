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

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type PageViewCount = typeof pageViewCounts.$inferSelect;
export type PageViewDaily = typeof pageViewDaily.$inferSelect;
