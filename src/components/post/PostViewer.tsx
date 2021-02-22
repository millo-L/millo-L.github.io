import { Link } from 'gatsby';
import React, { useCallback } from 'react';
import Styled from 'styled-components';
import { categoryMap } from '../../lib/styles/category';
import media from '../../lib/styles/media';
import { formatDate } from '../../lib/styles/utils';
import TagList from './TagList';

type PostType = {
    author: string;
    category: string;
    title: string;
    tags: Array<string>;
    released_at: string;
    updated_at: string;
    html: string;
}
const PostViewerWrapper = Styled.div`
    width: 60%;
    margin-left: 0;

    ${media.custom(1440)} {
        width: 80%;
    }
    ${media.custom(1056)} {
        width: 100%;
    }

    .category {
        text-decoration: none;
        font-size: 1.5rem;
        color: gray;
        margin-bottom: 0;
        &:hover {
            text-decoration: underline;
        }
    }

    .title {
        margin-top: 0;
        font-size: 3rem;
    }

    .date {
        line-height: 0.8;
        color: gray;
    }
`;

const PostContentWrapper = Styled.div`
    width: 100%;
    margin: 0;
    word-break: break-all;
`;

interface PostViewerProps {
    post: PostType;
}


const PostViewer = ({ post }: PostViewerProps) => {
    const { html, title, released_at, updated_at, category, tags } = post;

    const onClickTag = useCallback((tag: string) => {

    }, [tags]);

    return (
        <PostViewerWrapper>
            {category &&
                <Link className="category" to={`/?category=${category}`}>{
                    categoryMap[category]
                        ? <img src={categoryMap[category].src} />
                        : [{ category }]
                }</Link>}
            <h1 className="title">{title}</h1>
            <p className="date" >게시: {formatDate(released_at)}</p>
            {updated_at && <p className="date" >수정: {formatDate(updated_at)}</p>}
            {tags && <TagList tags={tags} onClick={onClickTag} />}
            <PostContentWrapper id="content-container" dangerouslySetInnerHTML={{ __html: html }} />
        </PostViewerWrapper>
    );
}

export default PostViewer;