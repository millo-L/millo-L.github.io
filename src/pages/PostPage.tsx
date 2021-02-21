import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import Header from '../components/base/Header';
import { SimpleBodyProfile } from '../components/common/SimpleProfile';
import MainPageRowTemplate from '../components/main/MainPageRowTemplate';
import MainResponsive from '../components/main/MainResponsive';
import PostTemplate from '../components/post/PostTemplate';
import PostToC from '../components/post/PostToC';
import PostViewer from '../components/post/PostViewer';
import ToC from '../components/post/ToC';

interface PostPageProps {
  data: any;
}

const PostPage = ({ data }: PostPageProps) => {
  const { markdownRemark } = data
  const { frontmatter, html, tableOfContents } = markdownRemark;

  return (
    <PostTemplate>
      <Header />
      <MainResponsive style={{ marginTop: "2rem" }} >
        <MainPageRowTemplate>
          <SimpleBodyProfile style={{ marginTop: "0.5rem" }} />
          <PostViewer post={{ ...frontmatter, html }} />
          <PostToC tableOfContents={tableOfContents} />
        </MainPageRowTemplate>
      </MainResponsive>
    </PostTemplate>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      tableOfContents(absolute: false, maxDepth: 6, heading: null)
      frontmatter {
        path
        author
        category
        released_at(formatString: "YYYY년 MM월 DD일")
        updated_at(formatString: "YYYY년 MM월 DD일")
        tags
        title
      }
    }
  }
`

export default PostPage;