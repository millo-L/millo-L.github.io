import React from 'react';
import Styled from 'styled-components';
import media, { mediaQuery } from '../../lib/styles/media';
import palette from '../../lib/styles/palette';
import { PartialPostType } from '../post/PostCard';
import SeriesPost from './SeriesPost';

const Wrapper = Styled.div`
    display: flex;
    margin: -1rem;
    width: 40%;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    margin-top: 3rem;
    ${mediaQuery(1440)} {
        width: 50%;
    }
    ${mediaQuery(1056)} {
        width: 100%;
    }
    ${mediaQuery(767)} {
        margin: 0;
    }

    .series-header {
        width: 100%;
        border-bottom: 1px solid ${palette.gray[3]};
        h1 {
            ${media.custom(1056)} {
                font-size: 1.4rem;
            }
        }
        h3 {
            width: 3.4rem;
            color: ${palette.indigo[7]};
            border-bottom: 4px solid ${palette.indigo[7]};
            ${media.custom(1056)} {
                font-size: 1rem;
                border-bottom: 3px solid ${palette.indigo[7]};
                width: 2.9rem;
            }
        }
    }
`
interface SeriesPostListProps {
    posts: Array<PartialPostType>;
    series: string;
}

const SeriesPostList = ({ posts, series }: SeriesPostListProps) => {
    console.log(posts);
    return (
        <Wrapper>
            <div className="series-header">
                <h3>시리즈</h3>
                <h1>{series}</h1>
            </div>
            {posts.map((post, index) => (
                <SeriesPost post={post} index={index} key={index} />
            ))}
        </Wrapper>
    );
}

export default SeriesPostList;