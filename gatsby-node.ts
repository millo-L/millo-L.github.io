import path from "path";
import { GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

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
		nodes: [
			{
				frontmatter: {
					series: string;
				};
				fields: {
					slug: string;
				};
			},
		];
		group: [
			{
				nodes: [
					{
						frontmatter: {
							series: string;
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
					}
					fields {
						slug
					}
				}
				group(field: { frontmatter: { series: SELECT } }, limit: 1) {
					nodes {
						frontmatter {
							series
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
				},
			}),
	);
};
