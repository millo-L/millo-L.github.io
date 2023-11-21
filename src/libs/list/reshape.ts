import {
	PostListAllMarkdownRemark,
	PostType,
	SeriesListAllMarkdownRemark,
	SeriesType,
} from "../../types/Common";

export const reshapePost = (allMarkdownRemark: PostListAllMarkdownRemark): PostType[] => {
	if (!allMarkdownRemark) return [];

	return allMarkdownRemark.nodes.map((node) => ({
		path: node.fields.slug,
		title: node.frontmatter.title,
		description: node.frontmatter.description,
		released_at: node.frontmatter.released_at,
		updated_at: node.frontmatter.updated_at || undefined,
		image: node.frontmatter.image
			? node.frontmatter.image.childImageSharp.gatsbyImageData
			: null,
		lang: node.frontmatter.lang,
		category: node.frontmatter.category,
	}));
};

export const reshapeSeries = (allMarkdownRemark: SeriesListAllMarkdownRemark): SeriesType[] => {
	if (!allMarkdownRemark) return [];

	return allMarkdownRemark.group.map((each) => ({
		path: `/series/${each.fieldValue.replace(/ /gi, "-")}`,
		title: each.fieldValue,
		image: each.nodes[0].frontmatter.image
			? each.nodes[0].frontmatter.image.childImageSharp.gatsbyImageData
			: null,
		released_at: each.nodes[0].frontmatter.released_at,
		updated_at: each.nodes[0].frontmatter.updated_at || undefined,
		lang: each.nodes[0].frontmatter.lang,
		totalCount: each.totalCount,
	}));
};
