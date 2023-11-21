import type { GatsbyConfig } from "gatsby";

type RssQueryType = {
	query: {
		allMarkdownRemark: {
			nodes: [
				{
					frontmatter: {
						title: string;
						released_at: string;
						description: string;
					};
					fields: {
						slug: string;
					};
					excerpt: string;
				},
			];
		};
		site: {
			siteMetadata: {
				siteUrl: string;
			};
		};
	};
};

const config: GatsbyConfig = {
	siteMetadata: {
		author: "millo",
		title: "millo's tech blog",
		description: "millo's tech blog",
		siteUrl: "https://millo-L.github.io",
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		"gatsby-plugin-styled-components",
		"gatsby-plugin-image",
		"gatsby-plugin-sitemap",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: "contents/images/logo.png",
			},
		},
		{
			resolve: "gatsby-plugin-feed",
			options: {
				feeds: [
					{
						serialize: ({ query: { site, allMarkdownRemark } }: RssQueryType) =>
							allMarkdownRemark.nodes.map((node) => ({
								title: node.frontmatter.title,
								description: node.frontmatter.description,
								date: node.frontmatter.released_at,
								url: `${site.siteMetadata.siteUrl}${node.fields.slug}`,
								guid: `${site.siteMetadata.siteUrl}${node.fields.slug}`,
								custom_elements: [{ "content:encoded": node.excerpt }],
								copyright: `© 2021-${new Date().getFullYear()} millo All rights reserved.`,
							})),
						query: `
							{
								allMarkdownRemark(sort: {frontmatter: {released_at: ASC}}) {
									nodes {
										frontmatter {
											title
											released_at
											description
										}
										fields {
											slug
										}
										excerpt(pruneLength: 1000)
									}
								}
								site {
									siteMetadata {
										siteUrl
									}
								}
							}
						`,
						output: "feed.xml",
						title: "millo's tech blog",
						description: "millo's tech blog",
						site_url: "https://millo-L.github.io",
					},
				],
			},
		},
		{
			resolve: "gatsby-transformer-remark",
			options: {
				plugins: [
					{
						resolve: "gatsby-remark-images",
						options: {
							maxWidth: 1046,
							showCaptions: false,
						},
					},
					{
						resolve: "gatsby-remark-prismjs",
						options: {
							showLineNumbers: true,
						},
					},
					{
						resolve: "gatsby-remark-autolink-headers",
						options: {
							className: "anchor-header", // 이 class명으로 하이라이트 코드를 구현할 예정이므로 반드시 넣자.
							maintainCase: false, // 이 부분은 반드시 false로 하자. url이 대소문자를 구분하기 때문에 링크가 작동하지 않을 수 있다.
							removeAccents: true,
							elements: ["h2", "h3"], // 링크를 추가할 Header 종류 선택
						},
					},
				],
			},
		},
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./contents/images/",
			},
			__key: "images",
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "posts",
				path: "./contents/posts/",
			},
			__key: "posts",
		},
		{
			resolve: "gatsby-omni-font-loader",
			options: {
				enableListener: true,
				preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
				web: [
					{
						name: "Noto Sans KR",
						file: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600&display=swap",
					},
				],
			},
		},
	],
};

export default config;
