import { graphql } from 'gatsby';
import React from 'react';
import Header from '../base/Header';
import SimpleProfile from '../common/SimpleProfile';
import MainPageRowTemplate from '../main/MainPageRowTemplate';
import MainResponsive from '../main/MainResponsive';
import PostTemplate from '../post/PostTemplate';
import PostToC from '../post/PostToC';
import PostViewer from '../post/PostViewer';
import PostComment from './PostComment';

interface PostPageProps {
  data: any;
}

const PostPage = ({ data }: PostPageProps) => {
  const { markdownRemark } = data

  if (!markdownRemark) return <div></div>;

  return (
    <PostTemplate>
      <Header />
      <MainResponsive style={{ marginTop: "2rem" }} >
        <MainPageRowTemplate style={{ marginBottom: "5rem" }}>
          <SimpleProfile style={{ marginTop: "0.5rem" }} type='body' />
          <PostViewer post={{ ...markdownRemark.frontmatter, html: markdownRemark.html }} />
          <PostToC tableOfContents={markdownRemark.tableOfContents} />
        </MainPageRowTemplate>
        <PostComment
          title={markdownRemark.frontmatter.title}
          id={markdownRemark.id}
          path={markdownRemark.frontmatter.path}
        />
      </MainResponsive>
    </PostTemplate>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      id
      tableOfContents(absolute: false, maxDepth: 6, heading: null)
      frontmatter {
        path
        author
        category
        released_at(formatString: "YYYY-MM-DD")
        updated_at(formatString: "YYYY-MM-DD")
        tags
        title
      }
    }
  }
`

export default PostPage;