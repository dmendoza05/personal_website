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
	},
	{
		slug: 'task-manager',
		title: 'Task Manager',
		description:
			'A lightweight task management app with drag-and-drop boards, real-time sync, and offline support.',
		tags: ['React', 'Node.js', 'PostgreSQL'],
		href: 'https://tasks.example.com',
		repo: 'https://github.com/danielmendoza/task-manager',
		featured: true
	},
	{
		slug: 'weather-cli',
		title: 'Weather CLI',
		description:
			'A terminal weather tool that fetches forecasts from Open-Meteo with colorful output and location detection.',
		tags: ['Rust', 'CLI'],
		repo: 'https://github.com/danielmendoza/weather-cli',
		featured: true
	},
	{
		slug: 'api-starter',
		title: 'API Starter Kit',
		description:
			'An opinionated REST API template with authentication, validation, and OpenAPI documentation out of the box.',
		tags: ['Go', 'Docker', 'OpenAPI'],
		repo: 'https://github.com/danielmendoza/api-starter'
	}
];

export function getFeaturedProjects() {
	return projects.filter((p) => p.featured);
}
