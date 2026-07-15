import type { SkillId } from './skills';

export type Project = {
	slug: string;
	title: string;
	description: string;
	tags: SkillId[];
	href?: string;
	repo?: string;
	featured?: boolean;
};

export const projects: Project[] = [
	{
		slug: 'personal-website',
		title: 'Personal Website',
		description:
			'A SvelteKit portfolio site with projects, an about page, and a markdown-powered blog. Built with Tailwind CSS and i18n support.',
		tags: ['sveltekit', 'typescript', 'tailwindcss'],
		repo: 'https://github.com/dmendoza05/personal-website',
		featured: true
	}
];

export function getFeaturedProjects() {
	return projects.filter((p) => p.featured);
}
