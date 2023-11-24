import path from "path";
import { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";
import { LanguageType } from "./src/types/Common";

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({ actions, node, getNode }) => {
	const { createNodeField } = actions;

	if (node.internal.type !== "MarkdownRemark") return;
	const slug = createFilePath({ node, getNode, basePath: "" });
	const update_slug = slug.slice(11);
	createNodeField({
		node,
		name: "slug",
		value: update_slug,
	});
};

type QueryType = {
	allMarkdownRemark: {
		nodes: {
			frontmatter: {
				series: string;
				translation: string;
				lang: LanguageType;
			};
			fields: {
				slug: string;
			};
		}[];
		group: [
			{
				nodes: [
					{
						frontmatter: {
							series: string;
							translation_series: string;
							lang: LanguageType;
						};
					},
				];
			},
		];
	};
};

export const createPages: GatsbyNode["createPages"] = async ({ actions, graphql, reporter }) => {
	const { createPage } = actions;

	const postTemplate = path.resolve("src/components/post/PostTemplate.tsx");
	const seriesTemplate = path.resolve("src/components/series/SeriesTemplate.tsx");

	const result = await graphql<QueryType>(`
		{
			allMarkdownRemark(filter: { frontmatter: { is_private: { eq: false } } }) {
				nodes {
					frontmatter {
						series
						translation
						lang
					}
					fields {
						slug
					}
				}
				group(field: { frontmatter: { series: SELECT } }, limit: 1) {
					nodes {
						frontmatter {
							series
							translation_series
							lang
						}
					}
				}
			}
		}
	`);

	if (result.errors || !result.data) {
		reporter.panicOnBuild("Error while running GraphQL query.");
		return;
	}

	result.data.allMarkdownRemark.nodes.forEach((node) => {
		createPage({
			path: node.fields.slug,
			component: postTemplate,
			context: {
				slug: node.fields.slug,
				series: node.frontmatter.series,
				translation: node.frontmatter.translation,
				lang: node.frontmatter.lang,
			},
		});
	});

	result.data.allMarkdownRemark.group.forEach(
		(each) =>
			each.nodes[0].frontmatter.series !== "none" &&
			createPage({
				path: `/series/${each.nodes[0].frontmatter.series.replace(/ /gi, "-")}`,
				component: seriesTemplate,
				context: {
					series: each.nodes[0].frontmatter.series,
					translation_series: each.nodes[0].frontmatter.translation_series
						? `/series${each.nodes[0].frontmatter.translation_series}`
						: null,
					lang: each.nodes[0].frontmatter.lang,
				},
			}),
	);
};
