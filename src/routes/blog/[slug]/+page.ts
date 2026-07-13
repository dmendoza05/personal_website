import { error } from '@sveltejs/kit';
import { getPost, getPostSlugs } from '$lib/blog/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const post = getPost(params.slug);
	if (!post) {
		error(404, 'Post not found');
	}
	return { post };
};

export function entries() {
	return getPostSlugs().map((slug) => ({ slug }));
}
