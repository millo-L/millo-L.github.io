const path = require(`path`);

const { createFilePath } = require(`gatsby-source-filesystem`);
exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions;
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `` });
        const update_slug = slug.slice(11);
        createNodeField({
            node,
            name: `slug`,
            value: update_slug,
        });
    }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions;

    const postTemplate = path.resolve(`src/components/post/PostPage.tsx`);
    const seriesTemplate = path.resolve(
        `src/components/series/SeriesPostListPage.tsx`
    );

    const result = await graphql(`
        {
            allMarkdownRemark(
                filter: { frontmatter: { is_private: { eq: false } } }
            ) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
                            series
                        }
                    }
                }
                group(field: frontmatter___series, limit: 1) {
                    edges {
                        node {
                            frontmatter {
                                series
                            }
                        }
                    }
                }
            }
        }
    `);

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`);
        return;
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: postTemplate,
            context: {
                slug: node.fields.slug,
                series: node.frontmatter.series,
            }, // additional data can be passed via context
        });
    });

    result.data.allMarkdownRemark.group.forEach(({ edges }) => {
        edges[0].node.frontmatter.series !== "none" &&
            createPage({
                path: `/series/${edges[0].node.frontmatter.series.replace(
                    / /gi,
                    "-"
                )}`,
                component: seriesTemplate,
                context: {
                    series: edges[0].node.frontmatter.series,
                },
            });
    });
};
