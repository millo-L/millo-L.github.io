import { IGatsbyImageData } from "gatsby-plugin-image";

export type LanguageType = "ko" | "en";

export type CategoryType = { src: string; name: string };

export type PostListAllMarkdownRemark = {
	nodes: {
		frontmatter: {
			description: string;
			title: string;
			released_at: string;
			updated_at?: string;
			lang: LanguageType;
			category: string;
			image: {
				childImageSharp: {
					gatsbyImageData: IGatsbyImageData;
				};
			};
		};
		fields: {
			slug: string;
		};
	}[];
} | null;

export type PostType = {
	path: string;
	title: string;
	description: string;
	image: IGatsbyImageData | null;
	released_at: string;
	updated_at: string | undefined;
	lang: LanguageType;
	category: string;
};

export type SeriesPostType = {
	title: string;
	lang: LanguageType;
	path: string;
};

export type SeriesType = {
	path: string;
	title: string;
	image: IGatsbyImageData | null;
	released_at: string;
	updated_at?: string;
	totalCount: number;
	lang: LanguageType;
};

export type PostDetailType = {
	author: string;
	category: string;
	title: string;
	tags: string[];
	released_at: string;
	updated_at: string;
	html: string;
};

export type SeriesListAllMarkdownRemark = {
	group: {
		totalCount: number;
		fieldValue: string;
		nodes: [
			{
				frontmatter: {
					image: {
						childImageSharp: {
							gatsbyImageData: IGatsbyImageData;
						};
					};
					released_at: string;
					updated_at: string;
					lang: LanguageType;
				};
			},
		];
	}[];
};
