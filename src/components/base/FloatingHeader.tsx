import React, { useCallback, useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { getScrollTop } from '../../lib/styles/utils';
import HomeTab from '../home/HomeTab';
import MainResponsive from '../main/MainResponsive';

const Wrapper = Styled.div`
    position: fixed;
    top: 0;
    left: 0;
    background: white;
    width: 100%;
    z-index: 10;
    padding-left: 0.5rem;

    box-shadow: 0px 0 8px rgba(0, 0, 0, 0.08);
    .tab-wrapper {
        margin-top: -1.5rem;
    }
`;

interface FloatingHeaderProps {
    page: number;
    onClick: (index: number) => void;
};

const FloatingHeader = ({ page, onClick }: FloatingHeaderProps) => {
    const [visible, setVisible] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(0);
    const [marginTop, setMarginTop] = useState<number>(0);

    useEffect(() => {
        if (!wrapperRef.current) return;
        setHeight(wrapperRef.current.clientHeight);
        setMarginTop(-1 * wrapperRef.current.clientHeight);
    }, []);

    const prevScrollTop = useRef<number>(0);
    const direction = useRef<'UP' | 'DOWN'>('DOWN');
    const transitionPoint = useRef<number>(0);

    const onScroll = useCallback(() => {
        const scrollTop = getScrollTop();
        const nextDirection = prevScrollTop.current > scrollTop ? 'UP' : 'DOWN';

        if (
            direction.current === 'DOWN' &&
            nextDirection === 'UP' &&
            transitionPoint.current - scrollTop < 0
        ) {
            setVisible(true);
            transitionPoint.current = scrollTop;
        }

        if (
            direction.current === 'UP' &&
            nextDirection === 'DOWN' &&
            scrollTop - transitionPoint.current < -1 * height
        ) {
            transitionPoint.current = scrollTop + height;
        }

        if (scrollTop < 64) {
            setVisible(false);
        }

        setMarginTop(
            Math.min(0, -1 * height + transitionPoint.current - scrollTop),
        );

        direction.current = nextDirection;
        prevScrollTop.current = scrollTop;

    }, [height]);

    useEffect(() => {
        document.addEventListener('scroll', onScroll);
        return () => {
            document.removeEventListener('scroll', onScroll);
        };
    }, [onScroll]);

    return (
        <Wrapper
            style={
                visible
                    ? {
                        marginTop: marginTop,
                        display: 'block',
                    }
                    : {
                        marginTop: -1 * height,
                        opacity: 0,
                    }
            }
            ref={wrapperRef}
        >
            <div className="tab-wrapper">
                <MainResponsive>
                    <HomeTab setUser={true} page={page} onClick={onClick} />
                </MainResponsive>
            </div>
        </Wrapper>
    );
}

export default FloatingHeader;