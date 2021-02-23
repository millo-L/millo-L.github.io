/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
    /* Your site config here */
    siteMetadata: {
        title: "millo",
        author: "millo",
        description: `millo's tech blog`,
        siteUrl: `https://millo-L.github.io`,
    },
    plugins: [
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-plugin-styled-components`,
            options: {
                // Add any options here
            },
        },
        {
            resolve: `gatsby-plugin-typescript`,
            options: {
                isTSX: true, // defaults to false
                jsxPragma: `jsx`, // defaults to "React"
                allExtensions: true, // defaults to false
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown-pages`,
                path: `${__dirname}/src/posts`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-autolink-headers`,
                        options: {
                            className: `anchor-header`, // 이 class명으로 하이라이트 코드를 구현할 예정이므로 반드시 넣자.
                            maintainCase: false, // 이 부분은 반드시 false로 하자. url이 대소문자를 구분하기 때문에 링크가 작동하지 않을 수 있다.
                            removeAccents: true,
                            elements: [`h1`, `h2`], // 링크를 추가할 Header 종류 선택
                        },
                    },
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 1046,
                            showCaptions: true,
                        },
                    },
                    {
                        resolve: `gatsby-remark-prismjs`, // 코드 하일라이팅, npm i prismjs 해야 함.
                        options: {
                            showLineNumbers: false,
                        },
                    },
                ],
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sitemap`,
        {
            resolve: "gatsby-plugin-robots-txt",
            options: {
                host: "https://millo-L.github.io",
                sitemap: "https://millo-L.github.io/sitemap.xml",
                policy: [{ userAgent: "*", allow: "/" }],
            },
        },
        {
            resolve: `gatsby-plugin-disqus`,
            options: {
                shortname: `millo-l`,
            },
        },
        {
            resolve: "gatsby-plugin-apollo",
            options: {
                uri: "https://example.com/graphql",
            },
        },
    ],
}
