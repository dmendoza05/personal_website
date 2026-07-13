import { error, fail } from '@sveltejs/kit';
import { getPost } from '$lib/blog/posts';
import { getApprovedComments, insertComment } from '$lib/server/db/comments';
import { getPageViewCount } from '$lib/server/db/pageviews';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

const MAX_NAME = 80;
const MAX_BODY = 2000;

export const load: PageServerLoad = async ({ params, url }) => {
	const post = getPost(params.slug);
	if (!post) {
		error(404, 'Post not found');
	}

	const [comments, viewCount] = await Promise.all([
		getApprovedComments(params.slug),
		getPageViewCount(url.pathname)
	]);

	return { post, comments, viewCount };
};

export const actions: Actions = {
	comment: async ({ request, params }) => {
		const post = getPost(params.slug);
		if (!post) {
			error(404, 'Post not found');
		}

		const form = await request.formData();
		const honeypot = String(form.get('website') ?? '').trim();
		if (honeypot) {
			return { success: true };
		}

		const authorName = String(form.get('authorName') ?? '').trim();
		const body = String(form.get('body') ?? '').trim();

		const fieldErrors: { authorName?: string; body?: string } = {};

		if (!authorName) {
			fieldErrors.authorName = 'Name is required';
		} else if (authorName.length > MAX_NAME) {
			fieldErrors.authorName = `Name must be ${MAX_NAME} characters or fewer`;
		}

		if (!body) {
			fieldErrors.body = 'Comment is required';
		} else if (body.length > MAX_BODY) {
			fieldErrors.body = `Comment must be ${MAX_BODY} characters or fewer`;
		}

		if (Object.keys(fieldErrors).length > 0) {
			return fail(400, { fieldErrors, values: { authorName, body } });
		}

		await insertComment({
			postSlug: params.slug,
			authorName,
			body
		});

		return { success: true };
	}
};
