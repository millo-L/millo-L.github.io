import { graphql } from 'gatsby';
import React, { memo } from 'react';
import { filterByLanguage, reshapePost } from '../../lib/list/reshape';
import SeriesPostList from './SeriesPostList';
import MainTemplate from '../main/MainTemplate';
import Header from '../base/Header';
import MainResponsive from '../main/MainResponsive';
import Footer from '../base/Footer';
import SEO from '../SEO';
import '../css/typography.css';
import { createGlobalStyle } from 'styled-components';

createGlobalStyle`
    body {
        font-family: "ELAND", serif;
    }
`;

interface SeriesPostListPageProps {
    data: any;
}

const description = (series: string) => {
    if (series === 'WebRTC 이론부터 실전까지') {
        return 'WebRTC의 이론을 먼저 공부하고 이론을 기반으로 구현을 해보자.'
    } else if (series === 'WebRTC theory to practice') {
        return "Let's study the theory of WebRTC first and implement it based on theory."
    }
}

const SeriesPostListPage = ({ data }: SeriesPostListPageProps) => {
    const { allMarkdownRemark, site } = data;
    if (!(allMarkdownRemark && site)) return <div></div>;

    return (
        <MainTemplate>
            <SEO
                title={allMarkdownRemark.edges[0].node.frontmatter.series}
                url={`${site.siteMetadata.siteUrl}/${allMarkdownRemark.edges[0].node.frontmatter.series.replace(/ /gi, '-')}`}
                lang={allMarkdownRemark.edges[0].node.frontmatter.lang}
                date={allMarkdownRemark.edges[0].node.frontmatter.released_at}
                image={allMarkdownRemark.edges[0].node.frontmatter.image.childImageSharp.fluid.src}
                description={description(allMarkdownRemark.edges[0].node.frontmatter.series)}
            />
            <Header
                lang={allMarkdownRemark.edges[0].node.frontmatter.lang}
                ko_to={
                    allMarkdownRemark.edges[0].node.frontmatter.lang === 'ko'
                        ? '#'
                        : (
                            allMarkdownRemark.edges[0].node.frontmatter.translation_series !== 'none'
                                ? '/series' + allMarkdownRemark.edges[0].node.frontmatter.translation_series
                                : '#'
                        )}
                en_to={
                    allMarkdownRemark.edges[0].node.frontmatter.lang === 'en'
                        ? '#'
                        : (
                            allMarkdownRemark.edges[0].node.frontmatter.translation_series !== 'none'
                                ? '/series' + allMarkdownRemark.edges[0].node.frontmatter.translation_series
                                : '#'
                        )}
            />
            <MainResponsive>
                <SeriesPostList
                    posts={filterByLanguage(reshapePost(allMarkdownRemark), allMarkdownRemark.edges[0].node.frontmatter.lang)}
                    series={allMarkdownRemark.edges[0].node.frontmatter.series}
                    lang={allMarkdownRemark.edges[0].node.frontmatter.lang}
                />
                <Footer />
            </MainResponsive>
        </MainTemplate>
    )

}

export const pageQuery = graphql`
    query($series: String!) {
        allMarkdownRemark(filter: {frontmatter: {series: {eq: $series}}}, sort: {fields: frontmatter___released_at, order: ASC}) {
            edges {
                    node {
                        id
                        frontmatter {
                            released_at
                            updated_at
                            title
                            description
                            image {
                                childImageSharp {
                                    fluid {
                                        ...GatsbyImageSharpFluid
                                    }
                                }
                            }
                            series
                            lang
                            translation_series
                        }
                    fields {
                        slug
                    }
                }
            }
        }
        site {
            siteMetadata {
                siteUrl
            }
        }
    }
`;

export default memo(SeriesPostListPage);