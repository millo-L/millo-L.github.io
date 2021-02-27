import { graphql } from 'gatsby';
import React, { useCallback } from 'react';
import Footer from '../base/Footer';
import Header from '../base/Header';
import SimpleProfile from '../common/SimpleProfile';
import MainPageRowTemplate from '../main/MainPageRowTemplate';
import MainResponsive from '../main/MainResponsive';
import PostTemplate from '../post/PostTemplate';
import PostToC from '../post/PostToC';
import PostViewer from '../post/PostViewer';
import SEO from '../SEO';
import PostComment from './PostComment';
import Utterances from './Utterances';
import '../css/typography.css';
import { createGlobalStyle } from 'styled-components';
import { PartialSeriesType } from './PostSeriesList';
import PrevNextPost from './PrevNextPost';
import { filterByLanguage } from '../../lib/list/reshape';

createGlobalStyle`
    body {
        font-family: "ELAND", serif;
    }
`;

interface PostPageProps {
  data: any;
}

const PostPage = ({ data }: PostPageProps) => {
  const { markdownRemark, site, allMarkdownRemark } = data
  if (!(markdownRemark && site && allMarkdownRemark)) return <div></div>;

  const reshapeSeries = useCallback(() => {
    const { edges } = allMarkdownRemark;
    let seriesList: Array<PartialSeriesType> = [];

    edges.map((edge) => {
      const { node } = edge;
      let series: PartialSeriesType = {
        title: node.frontmatter.title,
        lang: node.frontmatter.lang,
        slug: node.fields.slug,
      }

      seriesList.push(series);
    });

    return seriesList;
  }, [allMarkdownRemark]);

  return (
    <PostTemplate>
      <SEO
        title={markdownRemark.frontmatter.title}
        description={markdownRemark.frontmatter.description}
        date={markdownRemark.frontmatter.released_at}
        url={site.siteMetadata.siteUrl + markdownRemark.fields.slug}
        image={markdownRemark.frontmatter.image.childImageSharp.fluid.src}
        lang={markdownRemark.frontmatter.lang}
      />
      <Header
        lang={markdownRemark.frontmatter.lang}
        ko_to={markdownRemark.frontmatter.lang === 'ko' ? '#' : markdownRemark.frontmatter.translation}
        en_to={markdownRemark.frontmatter.lang === 'en' ? '#' : markdownRemark.frontmatter.translation}
      />
      <MainResponsive style={{ marginTop: "2rem" }} >
        <MainPageRowTemplate style={{ marginBottom: "2rem" }}>
          <SimpleProfile style={{ marginTop: "0.5rem" }} type='body' categoryVisible={true} lang={markdownRemark.frontmatter.lang} />
          <PostViewer
            post={{ ...markdownRemark.frontmatter, html: markdownRemark.html }}
            series={markdownRemark.frontmatter.series}
            seriesList={filterByLanguage(reshapeSeries(), markdownRemark.frontmatter.lang)}
            lang={markdownRemark.frontmatter.lang}
          />
          <PostToC tableOfContents={markdownRemark.tableOfContents} />
        </MainPageRowTemplate>
        {/*<PostComment
          title={markdownRemark.frontmatter.title}
          id={markdownRemark.id}
          path={markdownRemark.frontmatter.path}
        />*/}
        <Utterances />
        <Footer />
      </MainResponsive>
    </PostTemplate>
  );
}

export const pageQuery = graphql`
  query($slug: String!, $series: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      id
      tableOfContents(absolute: false, maxDepth: 2, heading: null)
      frontmatter {
        author
        description
        category
        released_at(formatString: "YYYY-MM-DD")
        updated_at(formatString: "YYYY-MM-DD")
        tags
        title
        lang
        series
        translation
        image {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid
                }
            }
        }
      }
      fields {
        slug
      }
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
    allMarkdownRemark(filter: {frontmatter: {series: {eq: $series}}}, sort: {order: ASC, fields: frontmatter___released_at}) {
      edges {
        node {
          frontmatter {
            title
            lang
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default PostPage;