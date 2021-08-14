import React from "react";
import Styled from "styled-components";
import { Disqus } from "gatsby-plugin-disqus";
import { mediaQuery } from "../../lib/styles/media";

const Wrapper = Styled.div`
    width: 60%;
    margin-left: auto;
    margin-right: auto;

    
    ${mediaQuery(1056)} {
        width: 100%;
    }
`;

interface PostCommentProps {
    path: string;
    title: string;
    id: string;
}

const PostComment = ({ id, title, path }: PostCommentProps) => {
    return (
        <Wrapper>
            <Disqus
                config={{
                    url: `https://millo-l.github.io${path}`,
                    identifier: id,
                    title,
                }}
            />
        </Wrapper>
    );
};

export default PostComment;
