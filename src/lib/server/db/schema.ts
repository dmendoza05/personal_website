import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const comments = pgTable('comments', {
	id: serial('id').primaryKey(),
	postSlug: text('post_slug').notNull(),
	authorName: text('author_name').notNull(),
	body: text('body').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	approved: boolean('approved').default(true).notNull()
});

export const pageViews = pgTable('page_views', {
	id: serial('id').primaryKey(),
	path: text('path').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
