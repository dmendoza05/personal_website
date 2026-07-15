import type { SkillId } from './skills';

export type Experience = {
	company: string;
	role: string;
	period: string;
	location?: string;
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
	location: string;
	summary: string;
	experience: Experience[];
	education: Education[];
	skills: SkillId[];
	languages: { name: string; proficiency: string }[];
};

export const resume: Resume = {
	name: 'Daniel Mendoza',
	title: 'Software Engineer III',
	location: 'Los Angeles Metropolitan Area',
	summary:
		'Software Engineer III at Age of Learning with 10+ years building front-end web and mobile experiences for education products. Work spans ABCmouse, ReadingIQ, Flutter apps, and in-house content tooling.',
	experience: [
		{
			company: 'Age of Learning',
			role: 'Software Engineer III',
			period: 'May 2022 – Present',
			location: 'Glendale, CA',
			bullets: [
				'Build in-house tooling for content creation and organization',
				'Helped develop and ship My Music Academy: Playful Piano with Flutter'
			]
		},
		{
			company: 'Age of Learning',
			role: 'Software Engineer II',
			period: 'Oct 2018 – May 2022',
			location: 'Glendale, CA',
			bullets: [
				'Front-end engineer for ReadingIQ and the ABCmouse International product',
				'Maintained the ReadingIQ web and mobile platform',
				'Contributed to the ABCmouse International app and its release in several target countries'
			]
		},
		{
			company: 'Age of Learning',
			role: 'Software Engineer I',
			period: 'Jun 2017 – Oct 2018',
			location: 'Glendale, CA',
			bullets: [
				'Front-end engineer supporting ABCmouse and ReadingIQ product development'
			]
		},
		{
			company: 'Age of Learning',
			role: 'Associate Software Engineer',
			period: 'Oct 2015 – Jun 2017',
			location: 'Glendale, CA',
			bullets: []
		}
	],
	education: [
		{
			school: 'General Assembly',
			degree: 'Full Stack Web Development',
			period: '2014 – 2015'
		}
	],
	skills: [
		'javascript',
		'typescript',
		'html',
		'css',
		'flutter',
		'dart',
		'angular',
		'react',
		'nodejs',
		'postgresql',
		'mongodb',
		'ruby',
		'git',
		'agile'
	],
	languages: [
		{ name: 'English', proficiency: 'Native or bilingual proficiency' },
		{ name: 'Tagalog', proficiency: 'Native or bilingual proficiency' }
	]
};
