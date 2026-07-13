export type BlogPostMeta = {
	slug: string;
	title: string;
	date: string;
	description: string;
};

export type BlogPost = BlogPostMeta & {
	html: string;
};
