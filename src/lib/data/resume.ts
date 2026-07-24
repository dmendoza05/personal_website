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
	title: 'Software Engineer',
	location: 'Los Angeles Metropolitan Area',
	summary:
		'Software Engineer with 10+ years experience building front-end web and mobile experiences for education products. Work spans ABCmouse, ReadingIQ, Mastery Schools products, and in-house content tooling.',
	experience: [
		{
			company: 'Age of Learning',
			role: 'Software Engineer III',
			period: 'May 2022 – Present',
			location: 'Glendale, CA',
			bullets: [
				'Build in-house tooling for content creation and organization',
				'Expiremented with early AI implementation for educationalcontent creation and in-game integration',
				'Collaborated with other developers to implement various games, features and tools for the My Reading Academy and My Math Academy products'
			]
		},
		{
			company: 'Age of Learning',
			role: 'Software Engineer II',
			period: 'Oct 2018 – May 2022',
			location: 'Glendale, CA',
			bullets: [
				'Maintained, published, and released the ReadingIQ web and mobile platform(iOS and Android)',
				'Contributed to the ABCmouse International app and its release in several target countries',
				'Learned Unity and C#, to help support the development of the Internation ABCmouse Products',
			]
		},
		{
			company: 'Age of Learning',
			role: 'Software Engineer I',
			period: 'Jun 2017 – Oct 2018',
			location: 'Glendale, CA',
			bullets: [
				'Front-end engineer supporting ABCmouse and ReadingIQ product development',
				'Helped create the book player for the web version of ReadingIQ',
				'Created and implemented different features for ABCmouse 1.0 product'
			]
		},
		{
			company: 'Age of Learning',
			role: 'Associate Software Engineer',
			period: 'Oct 2015 – Jun 2017',
			location: 'Glendale, CA',
			bullets: [
				'Fixed multiple live-bugs and released them for the ABCmouse 1.0 product',
				'Supported the legacy frontend and backend systems for the ABCmouse 1.0 product',
				'Collaborated to update the ABCmouse 1.0 product to the new Angular 1.0 framework'
			]
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
