import type { SkillId } from './skills';

export type Experience = {
	company: string;
	role: string;
	period: string;
	bullets: string[];
};

export type Education = {
	school: string;
	degree: string;
	period: string;
};

export type Resume = {
	name: string;
	title: string;
	summary: string;
	experience: Experience[];
	education: Education[];
	skills: SkillId[];
};

export const resume: Resume = {
	name: 'Daniel Mendoza',
	title: 'Software Developer',
	summary:
		'Full-stack developer with a passion for building clean, performant web applications. Experienced in TypeScript, modern frameworks, and developer tooling.',
	experience: [
		{
			company: 'Acme Corp',
			role: 'Senior Software Engineer',
			period: '2023 – Present',
			bullets: [
				'Led migration of legacy monolith to microservices, reducing deployment time by 60%',
				'Built internal developer platform used by 50+ engineers',
				'Mentored junior developers and established code review standards'
			]
		},
		{
			company: 'StartupXYZ',
			role: 'Full-Stack Developer',
			period: '2021 – 2023',
			bullets: [
				'Developed customer-facing dashboard serving 10k+ daily active users',
				'Implemented real-time features using WebSockets and event-driven architecture',
				'Reduced page load times by 40% through performance optimization'
			]
		},
		{
			company: 'Freelance',
			role: 'Web Developer',
			period: '2019 – 2021',
			bullets: [
				'Delivered 15+ client projects including e-commerce and SaaS applications',
				'Collaborated with designers to implement responsive, accessible interfaces'
			]
		}
	],
	education: [
		{
			school: 'State University',
			degree: 'B.S. Computer Science',
			period: '2015 – 2019'
		}
	],
	skills: [
		'typescript',
		'javascript',
		'sveltekit',
		'react',
		'nodejs',
		'postgresql',
		'docker',
		'git',
		'ci-cd',
		'rest-apis',
		'testing'
	]
};
