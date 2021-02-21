import React, { useCallback, useEffect, useState } from 'react';
import Styled from 'styled-components';
import media from '../../lib/styles/media';
import palette from '../../lib/styles/palette';
import { getScrollTop } from '../../lib/styles/utils';

const Wrapper = Styled.div`
    padding: 0.5rem;
    padding-right: 1rem;
    order: 1;
    top: 10rem;
    margin-left: 4rem;
    position: sticky;
    height: 10rem;
    overflow-y: auto;

    ${media.custom(1440)} {
        display: none;
    }
`;

const ToCWrapper = Styled.div`
    ul {
        list-style: none;
        margin: 0;
        li {
            margin-bottom: 4px;
            p {
                margin: 0;
            }
            a {
                text-decoration: none;
                color: ${palette.gray[4]};
                font-size: 1rem;
                &:hover,
                &:focus {
                    color: ${palette.indigo[4]};
                }
                &:active {
                    color: ${palette.indigo[9]};
                    transform: scale(1.05);
                }
            }
        }
    }

`;

interface ToCProps {
    tableOfContents: string;
}

const ToC = ({ tableOfContents }: ToCProps) => {
    const [active, setActive] = useState<HTMLAnchorElement | null>(null);
    const [headingTops, setHeadingTops] = useState<
        | null
        | {
            id: string;
            top: number;
        }[]
    >(null);
    const [allTags, setAllTags] = useState<Array<HTMLAnchorElement>>([]);

    const updateTocPositions = useCallback(() => {
        if (!tableOfContents) return;
        const scrollTop = getScrollTop();
        const toc = Array.from(document.querySelector('#content-container').querySelectorAll('h1, h2, h3')).filter((h: Element) => h.id);
        const headingTops = toc.map(({ id }) => {
            const el = document.getElementById(id);
            if (!el) {
                return {
                    id,
                    top: 0,
                };
            }
            const top = el.getBoundingClientRect().top + scrollTop;
            return {
                id,
                top,
            };
        });
        setHeadingTops(headingTops);

        const aTag = Array.from(document.querySelector(`#toc-container`).querySelectorAll('a'));
        setAllTags(aTag);
    }, [tableOfContents]);

    useEffect(() => {
        updateTocPositions();
        let prevScrollHeight = document.body.scrollHeight;
        let timeoutId: number | null = null;
        function checkScrollHeight() {
            const scrollHeight = document.body.scrollHeight;
            if (prevScrollHeight !== scrollHeight) {
                updateTocPositions();
            }
            prevScrollHeight = scrollHeight;
            timeoutId = setTimeout(checkScrollHeight, 250);
        }
        timeoutId = setTimeout(checkScrollHeight, 250);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [updateTocPositions]);

    const onScroll = useCallback(() => {
        const scrollTop = getScrollTop();
        if (!headingTops) return;
        const currentHeading = [...headingTops].reverse().find(headingTop => {
            return scrollTop >= headingTop.top - 4;
        });
        if (active) active.classList.remove('active');

        if (!currentHeading) {
            return;
        }

        const newActive = allTags.filter(tag => tag.innerText === currentHeading.id);
        if (newActive.length === 0) return;

        newActive[0].classList.add('active');

        console.log(newActive);

        //newActive.classList.add('active');
        //setActive(newActive);
    }, [headingTops, active, allTags]);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    // For post SSR
    useEffect(() => {
        onScroll();
    }, [onScroll]);

    if (!tableOfContents || !headingTops) return null;

    return (
        <Wrapper>
            <ToCWrapper id="toc-container" dangerouslySetInnerHTML={{ __html: tableOfContents }} />
        </Wrapper>
    );
}

export default ToC;

