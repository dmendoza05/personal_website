import { error } from '@sveltejs/kit';
import { getProjectArticle } from '$lib/data/project-articles';
import { getProject } from '$lib/data/projects';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = getProject(params.slug);
	if (!project) error(404, 'Work not found');

	return {
		project,
		articleHtml: getProjectArticle(params.slug)
	};
};
