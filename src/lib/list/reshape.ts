import { PartialPostType } from "../../components/post/PostCard";
import { SeriesType } from "../../components/series/SeriesCard";

export const reshapePost = (allMarkdownRemark: any) => {
    let posts: Array<PartialPostType> = [];
    const { edges } = allMarkdownRemark;

    edges.map(edge => {
        const obj = edge.node.frontmatter;
        let post: PartialPostType = {
            path: edge.node.fields.slug,
            title: obj.title,
            description: obj.description,
            released_at: obj.released_at,
            updated_at: obj.updated_at,
            image: obj.image ? obj.image.childImageSharp.fluid : null,
            lang: obj.lang,
            category: obj.category,
        };

        posts.push(post);
    });

    return posts;
};

export const filterByCategory = (
    posts: Array<PartialPostType>,
    category: string
) => {
    return posts.filter(post => post.category === category);
};

export function filterByLanguage<T>(list: T[], lang: string) {
    return list.filter(item => (item as any).lang === lang);
}

export const reshapeSeries = (allMarkdownRemark: any) => {
    let seriesList: Array<SeriesType> = [];
    const { group } = allMarkdownRemark;
    let len = group.length;

    for (let i = 0; i < len; i++) {
        const obj = group[i].nodes[0].frontmatter;
        let series: SeriesType = {
            path: `/series/${group[i].fieldValue.replace(/ /gi, "-")}`,
            title: group[i].fieldValue,
            image: obj.image ? obj.image.childImageSharp.fluid : null,
            updated_at: obj.released_at,
            totalCount: group[i].totalCount,
            lang: obj.lang,
        };
        seriesList.push(series);
    }

    return seriesList;
};
