export type SkillArea =
	| 'frontend'
	| 'backend'
	| 'mobile'
	| 'data'
	| 'devops'
	| 'administrative'
	| 'design'
	| 'ai'
	| 'general';

export type SkillCategory =
	| 'language'
	| 'framework'
	| 'library'
	| 'database'
	| 'cloud'
	| 'cms'
	| 'tool'
	| 'platform'
	| 'practice';

export type Skill = {
	id: string;
	label: string;
	category: SkillCategory;
	areas: SkillArea[];
};

export const skills = [
	// Languages
	{ id: 'javascript', label: 'JavaScript', category: 'language', areas: ['frontend', 'backend'] },
	{ id: 'typescript', label: 'TypeScript', category: 'language', areas: ['frontend', 'backend'] },
	{ id: 'python', label: 'Python', category: 'language', areas: ['backend', 'data', 'ai'] },
	{ id: 'java', label: 'Java', category: 'language', areas: ['backend'] },
	{ id: 'csharp', label: 'C#', category: 'language', areas: ['backend'] },
	{ id: 'cpp', label: 'C++', category: 'language', areas: ['backend'] },
	{ id: 'c', label: 'C', category: 'language', areas: ['backend'] },
	{ id: 'go', label: 'Go', category: 'language', areas: ['backend', 'devops'] },
	{ id: 'rust', label: 'Rust', category: 'language', areas: ['backend'] },
	{ id: 'php', label: 'PHP', category: 'language', areas: ['backend'] },
	{ id: 'ruby', label: 'Ruby', category: 'language', areas: ['backend'] },
	{ id: 'swift', label: 'Swift', category: 'language', areas: ['mobile'] },
	{ id: 'kotlin', label: 'Kotlin', category: 'language', areas: ['mobile', 'backend'] },
	{ id: 'dart', label: 'Dart', category: 'language', areas: ['mobile', 'frontend'] },
	{ id: 'scala', label: 'Scala', category: 'language', areas: ['backend', 'data'] },
	{ id: 'r', label: 'R', category: 'language', areas: ['data'] },
	{ id: 'sql', label: 'SQL', category: 'language', areas: ['backend', 'data'] },
	{ id: 'bash', label: 'Bash', category: 'language', areas: ['devops'] },
	{ id: 'powershell', label: 'PowerShell', category: 'language', areas: ['devops', 'administrative'] },
	{ id: 'html', label: 'HTML', category: 'language', areas: ['frontend'] },
	{ id: 'css', label: 'CSS', category: 'language', areas: ['frontend'] },
	{ id: 'sass', label: 'Sass/SCSS', category: 'language', areas: ['frontend'] },

	// Frontend frameworks & libraries
	{ id: 'react', label: 'React', category: 'framework', areas: ['frontend'] },
	{ id: 'nextjs', label: 'Next.js', category: 'framework', areas: ['frontend', 'backend'] },
	{ id: 'vue', label: 'Vue', category: 'framework', areas: ['frontend'] },
	{ id: 'nuxt', label: 'Nuxt', category: 'framework', areas: ['frontend', 'backend'] },
	{ id: 'angular', label: 'Angular', category: 'framework', areas: ['frontend'] },
	{ id: 'svelte', label: 'Svelte', category: 'framework', areas: ['frontend'] },
	{ id: 'sveltekit', label: 'SvelteKit', category: 'framework', areas: ['frontend', 'backend'] },
	{ id: 'astro', label: 'Astro', category: 'framework', areas: ['frontend'] },
	{ id: 'remix', label: 'Remix', category: 'framework', areas: ['frontend', 'backend'] },
	{ id: 'jquery', label: 'jQuery', category: 'library', areas: ['frontend'] },
	{ id: 'tailwindcss', label: 'Tailwind CSS', category: 'library', areas: ['frontend'] },
	{ id: 'bootstrap', label: 'Bootstrap', category: 'library', areas: ['frontend'] },
	{ id: 'material-ui', label: 'Material UI', category: 'library', areas: ['frontend'] },
	{ id: 'chakra-ui', label: 'Chakra UI', category: 'library', areas: ['frontend'] },
	{ id: 'shadcn-ui', label: 'shadcn/ui', category: 'library', areas: ['frontend'] },
	{ id: 'redux', label: 'Redux', category: 'library', areas: ['frontend'] },
	{ id: 'zustand', label: 'Zustand', category: 'library', areas: ['frontend'] },
	{ id: 'threejs', label: 'Three.js', category: 'library', areas: ['frontend'] },
	{ id: 'animejs', label: 'Anime.js', category: 'library', areas: ['frontend'] },

	// Mobile
	{ id: 'flutter', label: 'Flutter', category: 'framework', areas: ['mobile'] },
	{ id: 'react-native', label: 'React Native', category: 'framework', areas: ['mobile'] },
	{ id: 'swiftui', label: 'SwiftUI', category: 'framework', areas: ['mobile'] },
	{ id: 'ionic', label: 'Ionic', category: 'framework', areas: ['mobile'] },
	{ id: 'android', label: 'Android', category: 'platform', areas: ['mobile'] },
	{ id: 'ios', label: 'iOS', category: 'platform', areas: ['mobile'] },

	// Backend
	{ id: 'nodejs', label: 'Node.js', category: 'platform', areas: ['backend'] },
	{ id: 'express', label: 'Express', category: 'framework', areas: ['backend'] },
	{ id: 'nestjs', label: 'NestJS', category: 'framework', areas: ['backend'] },
	{ id: 'fastify', label: 'Fastify', category: 'framework', areas: ['backend'] },
	{ id: 'django', label: 'Django', category: 'framework', areas: ['backend'] },
	{ id: 'flask', label: 'Flask', category: 'framework', areas: ['backend'] },
	{ id: 'fastapi', label: 'FastAPI', category: 'framework', areas: ['backend', 'ai'] },
	{ id: 'spring-boot', label: 'Spring Boot', category: 'framework', areas: ['backend'] },
	{ id: 'aspnet', label: 'ASP.NET', category: 'framework', areas: ['backend'] },
	{ id: 'laravel', label: 'Laravel', category: 'framework', areas: ['backend'] },
	{ id: 'rails', label: 'Ruby on Rails', category: 'framework', areas: ['backend'] },
	{ id: 'graphql', label: 'GraphQL', category: 'practice', areas: ['frontend', 'backend'] },
	{ id: 'rest-apis', label: 'REST APIs', category: 'practice', areas: ['backend'] },
	{ id: 'grpc', label: 'gRPC', category: 'practice', areas: ['backend'] },
	{ id: 'websockets', label: 'WebSockets', category: 'practice', areas: ['frontend', 'backend'] },
	{ id: 'trpc', label: 'tRPC', category: 'library', areas: ['frontend', 'backend'] },
	{ id: 'openapi', label: 'OpenAPI / Swagger', category: 'tool', areas: ['backend'] },

	// Databases & data
	{ id: 'postgresql', label: 'PostgreSQL', category: 'database', areas: ['backend', 'data'] },
	{ id: 'mysql', label: 'MySQL', category: 'database', areas: ['backend', 'data'] },
	{ id: 'mariadb', label: 'MariaDB', category: 'database', areas: ['backend', 'data'] },
	{ id: 'sqlite', label: 'SQLite', category: 'database', areas: ['backend'] },
	{ id: 'mongodb', label: 'MongoDB', category: 'database', areas: ['backend', 'data'] },
	{ id: 'redis', label: 'Redis', category: 'database', areas: ['backend'] },
	{ id: 'elasticsearch', label: 'Elasticsearch', category: 'database', areas: ['backend', 'data'] },
	{ id: 'dynamodb', label: 'DynamoDB', category: 'database', areas: ['backend', 'data'] },
	{ id: 'oracle', label: 'Oracle', category: 'database', areas: ['backend', 'data'] },
	{ id: 'sql-server', label: 'SQL Server', category: 'database', areas: ['backend', 'data'] },
	{ id: 'snowflake', label: 'Snowflake', category: 'database', areas: ['data'] },
	{ id: 'bigquery', label: 'BigQuery', category: 'database', areas: ['data'] },
	{ id: 'redshift', label: 'Redshift', category: 'database', areas: ['data'] },
	{ id: 'databricks', label: 'Databricks', category: 'platform', areas: ['data', 'ai'] },
	{ id: 'spark', label: 'Apache Spark', category: 'platform', areas: ['data'] },
	{ id: 'kafka', label: 'Apache Kafka', category: 'platform', areas: ['backend', 'data'] },
	{ id: 'rabbitmq', label: 'RabbitMQ', category: 'tool', areas: ['backend'] },
	{ id: 'prisma', label: 'Prisma', category: 'library', areas: ['backend'] },
	{ id: 'drizzle', label: 'Drizzle', category: 'library', areas: ['backend'] },
	{ id: 'sequelize', label: 'Sequelize', category: 'library', areas: ['backend'] },
	{ id: 'typeorm', label: 'TypeORM', category: 'library', areas: ['backend'] },

	// Cloud & infrastructure
	{ id: 'aws', label: 'AWS', category: 'cloud', areas: ['devops', 'backend'] },
	{ id: 'azure', label: 'Azure', category: 'cloud', areas: ['devops', 'backend'] },
	{ id: 'gcp', label: 'GCP', category: 'cloud', areas: ['devops', 'backend'] },
	{ id: 'vercel', label: 'Vercel', category: 'cloud', areas: ['devops', 'frontend'] },
	{ id: 'netlify', label: 'Netlify', category: 'cloud', areas: ['devops', 'frontend'] },
	{ id: 'cloudflare', label: 'Cloudflare', category: 'cloud', areas: ['devops'] },
	{ id: 'heroku', label: 'Heroku', category: 'cloud', areas: ['devops'] },
	{ id: 'digitalocean', label: 'DigitalOcean', category: 'cloud', areas: ['devops'] },
	{ id: 'docker', label: 'Docker', category: 'tool', areas: ['devops'] },
	{ id: 'kubernetes', label: 'Kubernetes', category: 'tool', areas: ['devops'] },
	{ id: 'terraform', label: 'Terraform', category: 'tool', areas: ['devops'] },
	{ id: 'ansible', label: 'Ansible', category: 'tool', areas: ['devops'] },
	{ id: 'nginx', label: 'Nginx', category: 'tool', areas: ['devops'] },
	{ id: 'linux', label: 'Linux', category: 'platform', areas: ['devops'] },
	{ id: 'firebase', label: 'Firebase', category: 'platform', areas: ['backend', 'mobile'] },
	{ id: 'supabase', label: 'Supabase', category: 'platform', areas: ['backend'] },
	{ id: 'neon', label: 'Neon', category: 'platform', areas: ['backend', 'data'] },

	// CMS & content
	{ id: 'wordpress', label: 'WordPress', category: 'cms', areas: ['frontend', 'backend', 'administrative'] },
	{ id: 'drupal', label: 'Drupal', category: 'cms', areas: ['frontend', 'backend', 'administrative'] },
	{ id: 'contentful', label: 'Contentful', category: 'cms', areas: ['administrative'] },
	{ id: 'sanity', label: 'Sanity', category: 'cms', areas: ['administrative'] },
	{ id: 'strapi', label: 'Strapi', category: 'cms', areas: ['backend', 'administrative'] },
	{ id: 'ghost', label: 'Ghost', category: 'cms', areas: ['administrative'] },
	{ id: 'webflow', label: 'Webflow', category: 'cms', areas: ['frontend', 'design', 'administrative'] },
	{ id: 'shopify', label: 'Shopify', category: 'cms', areas: ['frontend', 'administrative'] },
	{ id: 'magento', label: 'Magento', category: 'cms', areas: ['backend', 'administrative'] },
	{ id: 'markdown', label: 'Markdown / MDX', category: 'tool', areas: ['frontend', 'general'] },

	// Dev tools & platforms
	{ id: 'git', label: 'Git', category: 'tool', areas: ['general'] },
	{ id: 'github', label: 'GitHub', category: 'platform', areas: ['general', 'devops'] },
	{ id: 'gitlab', label: 'GitLab', category: 'platform', areas: ['general', 'devops', 'administrative'] },
	{ id: 'bitbucket', label: 'Bitbucket', category: 'platform', areas: ['general', 'administrative'] },
	{ id: 'jira', label: 'Jira', category: 'tool', areas: ['administrative'] },
	{ id: 'confluence', label: 'Confluence', category: 'tool', areas: ['administrative'] },
	{ id: 'linear', label: 'Linear', category: 'tool', areas: ['administrative'] },
	{ id: 'asana', label: 'Asana', category: 'tool', areas: ['administrative'] },
	{ id: 'trello', label: 'Trello', category: 'tool', areas: ['administrative'] },
	{ id: 'notion', label: 'Notion', category: 'tool', areas: ['administrative'] },
	{ id: 'figma', label: 'Figma', category: 'tool', areas: ['design'] },
	{ id: 'postman', label: 'Postman', category: 'tool', areas: ['backend'] },
	{ id: 'insomnia', label: 'Insomnia', category: 'tool', areas: ['backend'] },
	{ id: 'vscode', label: 'VS Code', category: 'tool', areas: ['general'] },
	{ id: 'jetbrains', label: 'JetBrains IDEs', category: 'tool', areas: ['general'] },

	// CI/CD & quality
	{ id: 'github-actions', label: 'GitHub Actions', category: 'tool', areas: ['devops'] },
	{ id: 'gitlab-ci', label: 'GitLab CI', category: 'tool', areas: ['devops'] },
	{ id: 'jenkins', label: 'Jenkins', category: 'tool', areas: ['devops'] },
	{ id: 'circleci', label: 'CircleCI', category: 'tool', areas: ['devops'] },
	{ id: 'ci-cd', label: 'CI/CD', category: 'practice', areas: ['devops'] },
	{ id: 'playwright', label: 'Playwright', category: 'tool', areas: ['frontend', 'general'] },
	{ id: 'cypress', label: 'Cypress', category: 'tool', areas: ['frontend'] },
	{ id: 'jest', label: 'Jest', category: 'tool', areas: ['frontend', 'backend'] },
	{ id: 'vitest', label: 'Vitest', category: 'tool', areas: ['frontend', 'backend'] },
	{ id: 'testing-library', label: 'Testing Library', category: 'library', areas: ['frontend'] },
	{ id: 'selenium', label: 'Selenium', category: 'tool', areas: ['frontend'] },
	{ id: 'testing', label: 'Testing', category: 'practice', areas: ['general'] },
	{ id: 'eslint', label: 'ESLint', category: 'tool', areas: ['frontend', 'backend'] },
	{ id: 'prettier', label: 'Prettier', category: 'tool', areas: ['frontend', 'backend'] },
	{ id: 'sonarqube', label: 'SonarQube', category: 'tool', areas: ['devops', 'administrative'] },

	// Observability
	{ id: 'datadog', label: 'Datadog', category: 'tool', areas: ['devops'] },
	{ id: 'sentry', label: 'Sentry', category: 'tool', areas: ['devops'] },
	{ id: 'new-relic', label: 'New Relic', category: 'tool', areas: ['devops'] },
	{ id: 'grafana', label: 'Grafana', category: 'tool', areas: ['devops'] },
	{ id: 'prometheus', label: 'Prometheus', category: 'tool', areas: ['devops'] },
	{ id: 'splunk', label: 'Splunk', category: 'tool', areas: ['devops', 'administrative'] },
	{ id: 'opentelemetry', label: 'OpenTelemetry', category: 'tool', areas: ['devops'] },
	{ id: 'pagerduty', label: 'PagerDuty', category: 'tool', areas: ['devops', 'administrative'] },

	// AI / ML
	{ id: 'tensorflow', label: 'TensorFlow', category: 'library', areas: ['ai'] },
	{ id: 'pytorch', label: 'PyTorch', category: 'library', areas: ['ai'] },
	{ id: 'scikit-learn', label: 'scikit-learn', category: 'library', areas: ['ai', 'data'] },
	{ id: 'huggingface', label: 'Hugging Face', category: 'platform', areas: ['ai'] },
	{ id: 'openai', label: 'OpenAI API', category: 'platform', areas: ['ai'] },
	{ id: 'langchain', label: 'LangChain', category: 'library', areas: ['ai'] },
	{ id: 'cursor', label: 'Cursor', category: 'tool', areas: ['ai', 'general'] },
	{ id: 'copilot', label: 'GitHub Copilot', category: 'tool', areas: ['ai', 'general'] },

	// Practices / process
	{ id: 'agile', label: 'Agile', category: 'practice', areas: ['administrative', 'general'] },
	{ id: 'scrum', label: 'Scrum', category: 'practice', areas: ['administrative'] },
	{ id: 'kanban', label: 'Kanban', category: 'practice', areas: ['administrative'] },
	{ id: 'code-review', label: 'Code Review', category: 'practice', areas: ['general'] },
	{ id: 'mentoring', label: 'Mentoring', category: 'practice', areas: ['general', 'administrative'] },
	{ id: 'system-design', label: 'System Design', category: 'practice', areas: ['backend', 'general'] },
	{ id: 'accessibility', label: 'Accessibility (a11y)', category: 'practice', areas: ['frontend', 'design'] },
	{ id: 'seo', label: 'SEO', category: 'practice', areas: ['frontend', 'administrative'] },
	{ id: 'i18n', label: 'i18n', category: 'practice', areas: ['frontend'] }
] as const satisfies readonly Skill[];

export type SkillId = (typeof skills)[number]['id'];

export const skillsById = Object.fromEntries(skills.map((skill) => [skill.id, skill])) as Record<
	SkillId,
	(typeof skills)[number]
>;

export function getSkill(id: SkillId) {
	return skillsById[id];
}

export function getSkillsByArea(area: SkillArea) {
	return skills.filter((skill) => (skill.areas as readonly SkillArea[]).includes(area));
}

export function getSkillsByCategory(category: SkillCategory) {
	return skills.filter((skill) => skill.category === category);
}
