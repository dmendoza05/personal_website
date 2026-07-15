/**
 * Regenerates `src/lib/data/skill-logo-data.ts` from Iconify icon packs.
 * Run: `pnpm skills:logos`
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { icons as simpleIcons } from '@iconify-json/simple-icons';
import { icons as devicon } from '@iconify-json/devicon';
import { icons as logos } from '@iconify-json/logos';
import { getIconData, iconToSVG } from '@iconify/utils';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src/lib/data/skill-logo-data.ts');

const packs = {
	'simple-icons': simpleIcons,
	devicon,
	logos
};

/** Maps skill id → [icon pack, icon name] */
const refs = {
	javascript: ['simple-icons', 'javascript'],
	typescript: ['simple-icons', 'typescript'],
	python: ['simple-icons', 'python'],
	java: ['devicon', 'java'],
	csharp: ['devicon', 'csharp'],
	cpp: ['simple-icons', 'cplusplus'],
	c: ['simple-icons', 'c'],
	go: ['simple-icons', 'go'],
	rust: ['simple-icons', 'rust'],
	php: ['simple-icons', 'php'],
	ruby: ['simple-icons', 'ruby'],
	swift: ['simple-icons', 'swift'],
	kotlin: ['simple-icons', 'kotlin'],
	dart: ['simple-icons', 'dart'],
	scala: ['simple-icons', 'scala'],
	r: ['simple-icons', 'r'],
	sql: ['simple-icons', 'postgresql'],
	bash: ['simple-icons', 'gnubash'],
	powershell: ['simple-icons', 'powershell'],
	html: ['simple-icons', 'html5'],
	css: ['simple-icons', 'css'],
	sass: ['simple-icons', 'sass'],
	react: ['simple-icons', 'react'],
	nextjs: ['simple-icons', 'nextdotjs'],
	vue: ['simple-icons', 'vuedotjs'],
	nuxt: ['simple-icons', 'nuxt'],
	angular: ['simple-icons', 'angular'],
	svelte: ['simple-icons', 'svelte'],
	sveltekit: ['simple-icons', 'svelte'],
	astro: ['simple-icons', 'astro'],
	remix: ['simple-icons', 'remix'],
	jquery: ['simple-icons', 'jquery'],
	tailwindcss: ['simple-icons', 'tailwindcss'],
	bootstrap: ['simple-icons', 'bootstrap'],
	'material-ui': ['simple-icons', 'mui'],
	'chakra-ui': ['simple-icons', 'chakraui'],
	'shadcn-ui': ['simple-icons', 'shadcnui'],
	redux: ['simple-icons', 'redux'],
	zustand: ['devicon', 'zustand'],
	threejs: ['simple-icons', 'threedotjs'],
	animejs: ['simple-icons', 'animedotjs'],
	flutter: ['simple-icons', 'flutter'],
	'react-native': ['simple-icons', 'react'],
	swiftui: ['simple-icons', 'swift'],
	ionic: ['simple-icons', 'ionic'],
	android: ['simple-icons', 'android'],
	ios: ['simple-icons', 'apple'],
	nodejs: ['simple-icons', 'nodedotjs'],
	express: ['simple-icons', 'express'],
	nestjs: ['simple-icons', 'nestjs'],
	fastify: ['simple-icons', 'fastify'],
	django: ['simple-icons', 'django'],
	flask: ['simple-icons', 'flask'],
	fastapi: ['simple-icons', 'fastapi'],
	'spring-boot': ['simple-icons', 'springboot'],
	aspnet: ['simple-icons', 'dotnet'],
	laravel: ['simple-icons', 'laravel'],
	rails: ['simple-icons', 'rubyonrails'],
	graphql: ['simple-icons', 'graphql'],
	'rest-apis': ['simple-icons', 'openapiinitiative'],
	grpc: ['logos', 'grpc'],
	websockets: ['logos', 'websocket'],
	trpc: ['simple-icons', 'trpc'],
	openapi: ['simple-icons', 'openapiinitiative'],
	postgresql: ['simple-icons', 'postgresql'],
	mysql: ['simple-icons', 'mysql'],
	mariadb: ['simple-icons', 'mariadb'],
	sqlite: ['simple-icons', 'sqlite'],
	mongodb: ['simple-icons', 'mongodb'],
	redis: ['simple-icons', 'redis'],
	elasticsearch: ['simple-icons', 'elasticsearch'],
	dynamodb: ['logos', 'aws-dynamodb'],
	oracle: ['logos', 'oracle'],
	'sql-server': ['logos', 'microsoft-icon'],
	snowflake: ['simple-icons', 'snowflake'],
	bigquery: ['simple-icons', 'googlebigquery'],
	redshift: ['logos', 'aws-redshift'],
	databricks: ['simple-icons', 'databricks'],
	spark: ['simple-icons', 'apachespark'],
	kafka: ['simple-icons', 'apachekafka'],
	rabbitmq: ['simple-icons', 'rabbitmq'],
	prisma: ['simple-icons', 'prisma'],
	drizzle: ['simple-icons', 'drizzle'],
	sequelize: ['simple-icons', 'sequelize'],
	typeorm: ['simple-icons', 'typeorm'],
	aws: ['logos', 'aws'],
	azure: ['logos', 'microsoft-azure'],
	gcp: ['simple-icons', 'googlecloud'],
	vercel: ['simple-icons', 'vercel'],
	netlify: ['simple-icons', 'netlify'],
	cloudflare: ['simple-icons', 'cloudflare'],
	heroku: ['logos', 'heroku-icon'],
	digitalocean: ['simple-icons', 'digitalocean'],
	docker: ['simple-icons', 'docker'],
	kubernetes: ['simple-icons', 'kubernetes'],
	terraform: ['simple-icons', 'terraform'],
	ansible: ['simple-icons', 'ansible'],
	nginx: ['simple-icons', 'nginx'],
	linux: ['simple-icons', 'linux'],
	firebase: ['simple-icons', 'firebase'],
	supabase: ['simple-icons', 'supabase'],
	neon: ['simple-icons', 'neon'],
	wordpress: ['simple-icons', 'wordpress'],
	drupal: ['simple-icons', 'drupal'],
	contentful: ['simple-icons', 'contentful'],
	sanity: ['simple-icons', 'sanity'],
	strapi: ['simple-icons', 'strapi'],
	ghost: ['simple-icons', 'ghost'],
	webflow: ['simple-icons', 'webflow'],
	shopify: ['simple-icons', 'shopify'],
	magento: ['logos', 'magento'],
	markdown: ['simple-icons', 'markdown'],
	git: ['simple-icons', 'git'],
	github: ['simple-icons', 'github'],
	gitlab: ['simple-icons', 'gitlab'],
	bitbucket: ['simple-icons', 'bitbucket'],
	jira: ['simple-icons', 'jira'],
	confluence: ['simple-icons', 'confluence'],
	linear: ['simple-icons', 'linear'],
	asana: ['simple-icons', 'asana'],
	trello: ['simple-icons', 'trello'],
	notion: ['simple-icons', 'notion'],
	figma: ['simple-icons', 'figma'],
	postman: ['simple-icons', 'postman'],
	insomnia: ['simple-icons', 'insomnia'],
	vscode: ['logos', 'visual-studio-code'],
	jetbrains: ['simple-icons', 'jetbrains'],
	'github-actions': ['simple-icons', 'githubactions'],
	'gitlab-ci': ['simple-icons', 'gitlab'],
	jenkins: ['simple-icons', 'jenkins'],
	circleci: ['simple-icons', 'circleci'],
	'ci-cd': ['simple-icons', 'githubactions'],
	playwright: ['logos', 'playwright'],
	cypress: ['simple-icons', 'cypress'],
	jest: ['simple-icons', 'jest'],
	vitest: ['simple-icons', 'vitest'],
	'testing-library': ['simple-icons', 'testinglibrary'],
	selenium: ['simple-icons', 'selenium'],
	testing: ['simple-icons', 'testinglibrary'],
	eslint: ['simple-icons', 'eslint'],
	prettier: ['simple-icons', 'prettier'],
	sonarqube: ['simple-icons', 'sonarqubeserver'],
	datadog: ['simple-icons', 'datadog'],
	sentry: ['simple-icons', 'sentry'],
	'new-relic': ['simple-icons', 'newrelic'],
	grafana: ['simple-icons', 'grafana'],
	prometheus: ['simple-icons', 'prometheus'],
	splunk: ['simple-icons', 'splunk'],
	opentelemetry: ['simple-icons', 'opentelemetry'],
	pagerduty: ['simple-icons', 'pagerduty'],
	tensorflow: ['simple-icons', 'tensorflow'],
	pytorch: ['simple-icons', 'pytorch'],
	'scikit-learn': ['simple-icons', 'scikitlearn'],
	huggingface: ['simple-icons', 'huggingface'],
	openai: ['logos', 'openai-icon'],
	langchain: ['simple-icons', 'langchain'],
	cursor: ['simple-icons', 'cursor'],
	copilot: ['simple-icons', 'githubcopilot'],
	scrum: ['simple-icons', 'scrumalliance'],
	'code-review': ['simple-icons', 'codereview'],
	accessibility: ['simple-icons', 'w3c'],
	i18n: ['simple-icons', 'i18next']
};

const out = {};
const failed = [];

for (const [id, [pack, name]] of Object.entries(refs)) {
	const data = getIconData(packs[pack], name);
	if (!data) {
		failed.push(`${id} → ${pack}:${name}`);
		continue;
	}

	const svg = iconToSVG(data, { height: '1em' });
	out[id] = {
		body: svg.body,
		viewBox: svg.attributes.viewBox ?? '0 0 24 24',
		width: svg.attributes.width ?? '1em',
		height: svg.attributes.height ?? '1em'
	};
}

if (failed.length) {
	console.error('Failed to resolve icons:\n' + failed.map((f) => `  - ${f}`).join('\n'));
	process.exit(1);
}

const entries = Object.entries(out)
	.map(
		([id, logo]) =>
			`\t${JSON.stringify(id)}: ${JSON.stringify(logo, null, '\t').replace(/\n/g, '\n\t')}`
	)
	.join(',\n');

const content = `/* Auto-generated by scripts/generate-skill-logos.mjs — do not edit by hand.
 * Regenerate: pnpm skills:logos
 */
import type { SkillId } from './skills';

export type SkillLogo = {
	body: string;
	viewBox: string;
	width: string;
	height: string;
};

export const skillLogos = {
${entries}
} as const satisfies Partial<Record<SkillId, SkillLogo>>;
`;

writeFileSync(outPath, content);
console.log(`Wrote ${Object.keys(out).length} logos → ${outPath}`);
