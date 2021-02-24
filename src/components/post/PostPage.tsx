import { graphql } from 'gatsby';
import React, { memo } from 'react';
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

interface PostPageProps {
  data: any;
}

const PostPage = ({ data }: PostPageProps) => {
  const { markdownRemark, site } = data

  if (!(markdownRemark && site)) return <div></div>;

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
      <Header />
      <MainResponsive style={{ marginTop: "2rem" }} >
        <MainPageRowTemplate style={{ marginBottom: "5rem" }}>
          <SimpleProfile style={{ marginTop: "0.5rem" }} type='body' categoryVisible={true} />
          <PostViewer post={{ ...markdownRemark.frontmatter, html: markdownRemark.html }} />
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
  query($slug: String!) {
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
  }
`

export default PostPage;