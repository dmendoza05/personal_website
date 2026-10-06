import { describe, expect, it } from 'vitest';
import {
	filterProjects,
	projectHasSource,
	projectSkillIds,
	type Project
} from './projects';

const sample: Project[] = [
	{
		slug: 'site',
		title: 'Personal Website',
		description: 'A portfolio with a blog.',
		type: 'website',
		tags: ['sveltekit', 'typescript'],
		keywords: ['portfolio', 'i18n'],
		repo: 'https://github.com/example/site'
	},
	{
		slug: 'notes',
		title: 'Notes',
		description: 'Something else entirely.',
		type: 'chrome-extension',
		tags: ['python'],
		keywords: ['notes']
	}
];

const idle = { query: '', skills: [], types: [], hasSource: false } as const;

describe('filterProjects', () => {
	it('returns every entry when nothing is selected', () => {
		expect(filterProjects(sample, { ...idle, query: '  ' })).toEqual(sample);
	});

	it('matches title, description, type, skill labels, and keywords without case', () => {
		expect(slugs({ query: 'personal' })).toEqual(['site']);
		expect(slugs({ query: 'BLOG' })).toEqual(['site']);
		expect(slugs({ query: 'sveltekit' })).toEqual(['site']);
		expect(slugs({ query: 'I18N' })).toEqual(['site']);
		expect(slugs({ query: 'chrome extension' })).toEqual(['notes']);
	});

	it('requires every selected skill', () => {
		expect(slugs({ skills: ['sveltekit', 'typescript'] })).toEqual(['site']);
		expect(slugs({ skills: ['sveltekit', 'python'] })).toEqual([]);
	});

	it('matches any selected type', () => {
		expect(slugs({ types: ['website', 'chrome-extension'] })).toEqual(['site', 'notes']);
		expect(slugs({ types: ['ios-app'] })).toEqual([]);
	});

	it('keeps only entries that have a source when that filter is on', () => {
		expect(projectHasSource(sample[0])).toBe(true);
		expect(projectHasSource(sample[1])).toBe(false);
		expect(projectHasSource({ ...sample[1], repo: '' })).toBe(false);
		expect(slugs({ hasSource: true })).toEqual(['site']);
	});

	it('applies search, skills, type, and source together', () => {
		expect(
			slugs({ query: 'portfolio', skills: ['typescript'], types: ['website'], hasSource: true })
		).toEqual(['site']);
		expect(slugs({ query: 'notes', skills: ['typescript'], types: ['website'], hasSource: true })).toEqual(
			[]
		);
	});
});

describe('projectSkillIds', () => {
	it('lists skills in first-seen order without duplicates', () => {
		expect(
			projectSkillIds([sample[0], { ...sample[1], tags: ['typescript', 'python'] }])
		).toEqual(['sveltekit', 'typescript', 'python']);
	});
});

function slugs(filter: Partial<typeof idle> = {}) {
	return filterProjects(sample, { ...idle, ...filter }).map((project) => project.slug);
}
