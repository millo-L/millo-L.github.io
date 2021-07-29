import React, { memo } from "react"
import Styled from "styled-components"
import { mediaQuery } from "../../lib/styles/media"
import Adsense from "../common/Adsense"
import PostCard, { PartialPostType } from "./PostCard"

const Wrapper = Styled.div`
    display: flex;
    margin: -1rem;
    flex-wrap: wrap;
    ${mediaQuery(767)} {
        margin: 0;
    }

    .adsense-block {
        width: 100%;
    }
`

interface PostCardGridProps {
    posts: Array<PartialPostType>
}

const PostCardGrid = ({ posts }: PostCardGridProps) => {
    return (
        <Wrapper>
            {posts.map((post, index) => (
                <PostCard post={post} key={index} />
            ))}
        </Wrapper>
    )
}

export default memo(PostCardGrid)
