import { PartialPostType } from "../../components/post/PostCard"

export const reshapePost = (allMarkdownRemark: any) => {
    let posts: Array<PartialPostType> = []
    const { edges } = allMarkdownRemark

    edges.map(edge => {
        const obj = edge.node.frontmatter
        let post: PartialPostType = {
            path: obj.path,
            title: obj.title,
            description: obj.description,
            released_at: obj.released_at,
            updated_at: obj.updated_at,
            image: obj.image ? obj.image.childImageSharp.fluid : null,
            lang: obj.lang,
        }

        posts.push(post)
    })

    return posts
}
