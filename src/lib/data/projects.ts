import { getSkill, type SkillId } from './skills';

export const projectTypes = [
	{
		id: 'website',
		label: 'Website',
		icon: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
	},
	{
		id: 'chrome-extension',
		label: 'Chrome extension',
		icon: 'M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c0 .617.236 1.234.706 1.704l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z'
	},
	{
		id: 'ios-app',
		label: 'iOS app',
		icon: 'M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01'
	},
	{
		id: 'android-app',
		label: 'Android app',
		icon: 'M8 10a4 4 0 0 1 8 0v5a4 4 0 0 1-8 0v-5zM9 9 7 5M15 9l2-4M7 13H4M17 13h3'
	},
	{
		id: 'desktop-app',
		label: 'Desktop app',
		icon: 'M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 21h8M12 17v4'
	}
] as const;

export type ProjectType = (typeof projectTypes)[number]['id'];

export type Project = {
	slug: string;
	title: string;
	description: string;
	type: ProjectType;
	tags: SkillId[];
	keywords: string[];
	thumbnail?: string;
	href?: string;
	repo?: string;
	featured?: boolean;
};

export type WorksFilter = {
	query: string;
	skills: SkillId[];
	types: ProjectType[];
	hasSource: boolean;
};

export const projects: Project[] = [
	{
		slug: 'danielmendoza-website',
		title: 'danielmendoza.io',
		description:
			'A SvelteKit portfolio site with projects, an about page, and a markdown-powered blog. Built with Tailwind CSS and i18n support.',
		type: 'website',
		tags: ['sveltekit', 'typescript', 'tailwindcss'],
		keywords: ['portfolio', 'i18n'],
		thumbnail: '/projects/danielmendoza-website.jpg',
		repo: 'https://github.com/dmendoza05/personal-website',
		featured: true
	},
	{
		slug: 'darkside',
		title: 'Darkside',
		description:
			'A Chrome extension that applies a dark theme to any website, with controls for brightness, contrast, and warmth.',
		type: 'chrome-extension',
		tags: ['javascript', 'html', 'css'],
		keywords: ['dark mode', 'eye care'],
		thumbnail: '/projects/darkside.jpg',
		repo: 'https://chromewebstore.google.com/detail/darkside/kkddlokgbhgmebbfngdapjkaloifdbbb'
	}
];

export function getFeaturedProjects() {
	return projects.filter((project) => project.featured);
}

export function projectSkillIds(list: Project[]): SkillId[] {
	const seen = new Set<SkillId>();
	const ids: SkillId[] = [];

	for (const project of list) {
		for (const tag of project.tags) {
			if (seen.has(tag)) continue;
			seen.add(tag);
			ids.push(tag);
		}
	}

	return ids;
}

export function projectHasSource(project: Project): boolean {
	return Boolean(project.repo);
}

export function getProjectType(id: ProjectType) {
	const type = projectTypes.find((entry) => entry.id === id);
	if (!type) throw new Error(`Unknown project type: ${id}`);
	return type;
}

export function filterProjects(list: Project[], filter: WorksFilter): Project[] {
	const query = filter.query.trim().toLowerCase();

	return list.filter((project) => {
		if (query && !matchesQuery(project, query)) return false;
		if (filter.skills.some((skill) => !project.tags.includes(skill))) return false;
		if (filter.types.length > 0 && !filter.types.includes(project.type)) return false;
		if (filter.hasSource && !projectHasSource(project)) return false;
		return true;
	});
}

function matchesQuery(project: Project, query: string): boolean {
	const haystack = [
		project.title,
		project.description,
		getProjectType(project.type).label,
		...project.tags.map((tag) => getSkill(tag).label),
		...project.keywords
	]
		.join('\n')
		.toLowerCase();

	return haystack.includes(query);
}
