export type Project = {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	href?: string;
	repo?: string;
	featured?: boolean;
};

export const projects: Project[] = [
	{
		slug: 'personal-website',
		title: 'Personal Website',
		description:
			'A SvelteKit portfolio site with projects, resume, and a markdown-powered blog. Built with Tailwind CSS and i18n support.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS'],
		repo: 'https://github.com/danielmendoza/personal-website',
		featured: true
	}
];

export function getFeaturedProjects() {
	return projects.filter((p) => p.featured);
}
