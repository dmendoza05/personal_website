import { and, asc, eq } from 'drizzle-orm';
import { getDb } from './index';
import { comments } from './schema';

export async function getApprovedComments(postSlug: string) {
	const db = getDb();
	return db
		.select()
		.from(comments)
		.where(and(eq(comments.postSlug, postSlug), eq(comments.approved, true)))
		.orderBy(asc(comments.createdAt));
}

export async function insertComment(input: {
	postSlug: string;
	authorName: string;
	body: string;
}) {
	const db = getDb();
	const [row] = await db
		.insert(comments)
		.values({
			postSlug: input.postSlug,
			authorName: input.authorName,
			body: input.body
		})
		.returning();
	return row;
}
