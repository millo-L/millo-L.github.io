import React from "react"
import { Link } from "gatsby"
import Styled, { css } from "styled-components"
import { mediaQuery } from "../../lib/styles/media"
import palette from "../../lib/styles/palette"
import { ellipsis, formatDate } from "../../lib/styles/utils"
import RatioImage from "./RatioImage"

const Wrapper = Styled.div`
    width: 20rem;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
    transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
    margin: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    ${mediaQuery(1919)} {
        width: calc(33% - 1.8125rem);
    }
    ${mediaQuery(1440)} {
        width: calc(33% - 1.9rem);
    }
    ${mediaQuery(1056)} {
        width: calc(50% - 2rem);
    }
    ${mediaQuery(767)} {
        margin: 0;
        width: 100%;
        & + & {
            margin-top: 1rem;
        }
    }
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
        ${mediaQuery(1024)} {
            transform: none;
        }
    }

`

const StyledLink = Styled(Link)`
    display: block;
    color: inherit;
    text-decoration: none;
`

const Content = Styled.div<{ clamp: boolean }>`
    padding: 1rem;
    display: flex;
    flex: 1;
    flex-direction: column;
    h4 {
        font-size: 1rem;
        margin: 0;
        margin-bottom: 0.25rem;
        line-height: 1.5;
        word-break: break-word;
        ${ellipsis}
        color: ${palette.gray[9]};
        ${mediaQuery(767)} {
            white-space: initial;
        }
    }
    .description-wrapper {
        flex: 1;
    }
    p {
        margin: 0;
        word-break: break-word;
        overflow-wrap: break-word;
        font-size: 0.875rem;
        line-height: 1.5;
        ${props =>
        props.clamp &&
        css`
                height: 3.9375rem;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
            `}
        /* ${props =>
        !props.clamp &&
        css`
                height: 15.875rem;
            `} */

        color: ${palette.gray[7]};
        margin-bottom: 1.5rem;
    }
    .sub-info {
        font-size: 0.75rem;
        line-height: 1.5;
        color: ${palette.gray[6]};
    }

`

export type PartialPostType = {
    id: string
    title: string
    short_description: string
    image: string
    url_slug: string
    is_private: boolean
    released_at: string
    updated_at: string
}

interface PostCardProps {
    post: PartialPostType
}

const PostCard = ({ post }: PostCardProps) => {
    return (
        <Wrapper>
            {post.image && (
                <StyledLink to="">
                    <RatioImage
                        widthRatio={1.916}
                        heightRatio={1}
                        src={post.image}
                    />
                </StyledLink>
            )}
            <Content clamp={post.image === ""}>
                <StyledLink to="">
                    <h4>{post.title}</h4>
                    <div className="description-wrapper">
                        <p>
                            {post.short_description.replace(/&#x3A;/g, ":")}
                            {post.short_description.length === 150 && "..."}
                        </p>
                    </div>
                </StyledLink>
                <div className="sub-info">
                    <span>{formatDate(post.released_at)}</span>
                    {post.updated_at && (
                        <>
                            <br />
                            <span>{formatDate(post.updated_at)} 수정됨</span>
                        </>
                    )}
                </div>
            </Content>
        </Wrapper>
    )
}

export default PostCard
