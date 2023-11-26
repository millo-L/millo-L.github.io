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
		group: {
			nodes: {
				id: string;
				fields: {
					slug: string;
				};
				frontmatter: {
					series: string;
					translation: string;
					translation_series: string;
					lang: LanguageType;
				};
			}[];
		}[];
	};
};

export const createPages: GatsbyNode["createPages"] = async ({ actions, graphql, reporter }) => {
	const { createPage } = actions;

	const postTemplate = path.resolve("src/components/post/PostTemplate.tsx");
	const seriesTemplate = path.resolve("src/components/series/SeriesTemplate.tsx");

	const result = await graphql<QueryType>(`
		{
			allMarkdownRemark(
				filter: { frontmatter: { is_private: { eq: false } } }
				sort: { frontmatter: { released_at: ASC } }
			) {
				group(field: { frontmatter: { series: SELECT } }) {
					nodes {
						id
						fields {
							slug
						}
						frontmatter {
							series
							translation
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

	result.data.allMarkdownRemark.group.forEach((each) =>
		each.nodes.forEach((node, index) => {
			createPage({
				path: node.fields.slug,
				component: postTemplate,
				context: {
					id: node.id,
					series: node.frontmatter.series,
					lang: node.frontmatter.lang,
					translation: node.frontmatter.translation,
				},
			});
			if (index === 0 && node.frontmatter.series !== "none") {
				createPage({
					path: `/series/${node.frontmatter.series.replace(/ /gi, "-")}`,
					component: seriesTemplate,
					context: {
						series: node.frontmatter.series,
						translation_series: node.frontmatter.translation_series
							? `/series${node.frontmatter.translation_series}`
							: null,
						lang: node.frontmatter.lang,
					},
				});
			}
		}),
	);
};
