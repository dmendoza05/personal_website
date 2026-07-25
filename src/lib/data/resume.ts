import type { SkillId } from './skills';
import resumeData from './resume.json';

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
	website: string;
	linkedin: string;
	github: string;
	summary: string;
	experience: Experience[];
	education: Education[];
	skills: SkillId[];
	languages: { name: string; proficiency: string }[];
};

export const resume = resumeData as Resume;
