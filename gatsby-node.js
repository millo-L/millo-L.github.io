const path = require(`path`)

const { createFilePath } = require(`gatsby-source-filesystem`)
exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode, basePath: `` })
        const update_slug = slug.slice(8)
        createNodeField({
            node,
            name: `slug`,
            value: update_slug,
        })
    }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
    const { createPage } = actions

    const postTemplate = path.resolve(`src/components/post/PostPage.tsx`)

    const result = await graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `)

    if (result.errors) {
        reporter.panicOnBuild(`Error while running GraphQL query.`)
        return
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: postTemplate,
            context: {
                slug: node.fields.slug,
            }, // additional data can be passed via context
        })
    })
}
