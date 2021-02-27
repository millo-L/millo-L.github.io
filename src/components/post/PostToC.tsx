import React, { memo, useEffect } from "react"
import Styled from 'styled-components';
import media from "../../lib/styles/media";
import palette from "../../lib/styles/palette";
import ScrollSpy from "./ScrollSpy"

const ToCWrapper = Styled.div`
    transition: 0.125s all ease-in;
    width: 20%;
    padding: 0.5rem;
    padding-right: 1rem;
    padding-left: 0;
    order: 1;
    top: 10rem;
    margin-left: 4rem;
    position: sticky;
    height: 30rem;
    overflow-y: auto;
    word-break: break-all;

    ${media.custom(1440)} {
        display: none;
    }
    ul:first-child {
        padding-left: 1rem;
        border-left: 2px solid ${palette.indigo[4]};
    }
    ul {
        list-style: none;
        margin: 0;
        li {
            
            border: none;
            margin-bottom: 4px;
            p {
                margin: 0;
            }
        }
    }
    a {
        text-decoration: none;
        color: ${palette.gray[4]};
        font-size: 0.9rem;
        &:hover,
        &:focus {
            color: ${palette.indigo[4]};
        }
        &.active {
            color: ${palette.indigo[9]};
            transform: scale(1.1);
        }
    }
    & + & {
        margin-top: 4px;
    }

`;

interface PostToCProps {
    tableOfContents: string
}

const PostToC = ({ tableOfContents }: PostToCProps) => {
    useEffect(() => {
        const post = document.querySelector("#content-container")
        const headings = Array.from(
            post.querySelectorAll("h1, h2")
        ).filter((h: any) => h.id)
        const toc = document.querySelector("#toc-container")

        new ScrollSpy(toc as HTMLElement, headings as HTMLElement[]);
    }, [])

    return (
        <ToCWrapper
            id="toc-container"
            dangerouslySetInnerHTML={{ __html: tableOfContents }}
        />
    )
}

export default memo(PostToC);