import { Link } from 'gatsby';
import React, { useCallback } from 'react';
import Styled from 'styled-components';
import { categoryMap } from '../../lib/styles/category';
import media from '../../lib/styles/media';
import palette from '../../lib/styles/palette';
import { formatDate } from '../../lib/styles/utils';
import PostSeriesList, { PartialSeriesType } from './PostSeriesList';
import PrevNextPost from './PrevNextPost';
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
    max-width: 972px;

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

        
        ${media.custom(1056)} {
            font-size: 1rem;
        }
    }

    .title {
        margin-top: 0.5rem;
        font-size: 3rem;
        ${media.custom(1056)} {
            font-size: 2.2rem;
        }
    }

    .date {
        line-height: 0.8;
        color: gray;
        ${media.custom(1056)} {
            font-size: 0.8rem;
        }
    }
`;

const PostContentWrapper = Styled.div`
    width: 100%;
    margin: 0;
    word-break: break-all;

    a {
        color: ${palette.indigo[6]};
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }

    h1 {
        margin-top: 3rem;
        ${media.custom(767)} {
            margin-top: 2rem;
            font-size: 1.8rem;
        }
    }

    h2 {
        margin-top: 0rem;
    }

    h3 {
        margin-top: 3rem;
        ${media.custom(767)} {
            margin-top: 2rem;
        }
    }

    p {
        font-size: 1.1rem;
        line-height: 1.8;
        ${media.custom(767)} {
            font-size: 0.9rem;
            line-height: 1.7;
        }
    }

    li {
        font-size: 1.1rem;
        line-height: 2;

        ${media.custom(767)} {
            font-size: 0.9rem;
            line-height: 1.7;
        }

        h4, p {
            margin: 0;
            font-size: 1.1rem;
            ${media.custom(767)} {
                font-size: 0.9rem;
                line-height: 1.7;
            }
        }
    }

    pre, code {
        font-size: 1rem;
        ${media.custom(767)} {
            font-size: 0.9rem;
        }
    }

    img {
        width: 100%;
    }
`;

interface PostViewerProps {
    post: PostType;
    series: string;
    seriesList: Array<PartialSeriesType>;
    lang: string;
}


const PostViewer = ({ post, series, seriesList, lang }: PostViewerProps) => {
    const { html, title, released_at, updated_at, category, tags } = post;

    const onClickTag = useCallback((tag: string) => {

    }, [tags]);

    return (
        <PostViewerWrapper>
            {category &&
                <Link className="category" to={lang === 'ko' ? `/?category=${category}` : `/en?category=${category}`}>{
                    categoryMap[category]
                        ? <img src={categoryMap[category].src} />
                        : [{ category }]
                }</Link>}
            <h1 className="title">{title}</h1>
            <p className="date" >{lang === 'ko' ? '게시: ' : ''}{formatDate(released_at, lang)}</p>
            {updated_at && <p className="date" >{lang === 'ko' ? '수정: ' : 'Last edited at '}{formatDate(updated_at, lang)}</p>}
            {tags && <TagList tags={tags} onClick={onClickTag} />}
            {series !== 'none' && <PostSeriesList series={series} seriesList={seriesList} nowPostTitle={title} lang={lang} />}
            <PostContentWrapper id="content-container" dangerouslySetInnerHTML={{ __html: html }} />
            <PrevNextPost nowPostTitle={title} seriesList={seriesList} lang={lang} />
        </PostViewerWrapper>
    );
}

export default PostViewer;