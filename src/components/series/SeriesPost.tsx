import React, { memo } from 'react';
import Styled, { css } from 'styled-components';
import Img from 'gatsby-image';
import media, { mediaQuery } from '../../lib/styles/media';
import { PartialPostType } from '../post/PostCard';
import { ellipsis, formatDate } from '../../lib/styles/utils';
import palette from '../../lib/styles/palette';
import RatioImage from '../common/RatioImage';
import { Link } from 'gatsby';

const Wrapper = Styled.div`
    width: 100%;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.04);
    transition: 0.25s box-shadow ease-in, 0.25s transform ease-in;
    margin-top: 2rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 20px 0 rgba(0, 0, 0, 0.08);
        ${mediaQuery(1024)} {
            transform: none;
        }
    }

    h2 {
        margin-left: 1rem;
        margin-top: 1.5rem;
        ${media.custom(1056)} {
            font-size: 1.3rem;
        }
    }

    img {
        border-top: 1px solid ${palette.gray[2]};
    }

`

const Content = Styled.div`
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
        color: ${palette.gray[7]};
        margin-bottom: 1.5rem;
    }
    .sub-info {
        font-size: 0.75rem;
        line-height: 1.5;
        color: ${palette.gray[6]};
    }

`

const StyledLink = Styled(Link)`
    display: block;
    color: inherit;
    text-decoration: none;
`

interface SeriesPost {
    post: PartialPostType;
    index: number;
}

const SeriesPost = ({ post, index }: SeriesPost) => {
    return (
        <Wrapper>
            <StyledLink to={`${post.path}`}>
                <h2>{index + 1}. {post.title}</h2>
            </StyledLink>
            {post.image && (
                <StyledLink to={`${post.path}`}>
                    <RatioImage
                        widthRatio={2}
                        heightRatio={1}
                        fluid={post.image}
                    />
                </StyledLink>
            )}
            <Content>
                <StyledLink to={`${post.path}`}>
                    <div className="description-wrapper">
                        <p>
                            {post.description.replace(/&#x3A;/g, ":")}
                            {post.description.length === 150 && "..."}
                        </p>
                    </div>
                </StyledLink>
                <StyledLink to={`${post.path}`}>
                    <div className="sub-info">
                        <span>{formatDate(post.released_at)}</span>
                        {post.updated_at && (
                            <>
                                <br />
                                <span>{formatDate(post.updated_at)} 수정됨</span>
                            </>
                        )}
                    </div>
                </StyledLink>
            </Content>
        </Wrapper>
    );
}

export default memo(SeriesPost);