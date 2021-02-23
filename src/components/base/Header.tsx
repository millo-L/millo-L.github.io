import React, { memo, useCallback, useRef, useState } from 'react';
import Styled from 'styled-components';
import useToggle from '../../lib/hooks/useToggle';
import { BsSearch } from 'react-icons/bs';
import MainResponsive from '../main/MainResponsive';
import { Link } from 'gatsby';
import media from '../../lib/styles/media';
import HeaderLanguage from './HeaderLanguage';
import HeaderLogo from './HeaderLogo';
import HeaderUserMenu from './HeaderUserMenu';
import SimpleProfile from '../common/SimpleProfile';

interface HeaderProps {

}

const Header = ({ }: HeaderProps) => {
    const [userMenuVisible, toggleUserMenu] = useToggle(false);
    const [language, setLanguage] = useState<string>('한국어');
    const ref = useRef<HTMLDivElement>(null);

    const onOutsideClick = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        if (ref.current.contains(e.target as any)) return;
        toggleUserMenu();
    }, [toggleUserMenu]);

    return (
        <Wrapper>
            <Inner
                style={{
                }}
            >
                <HeaderLogo />
                <Right>
                    {/*<SearchButton to="/search">
                        <BsSearch style={{}} />
                    </SearchButton>*/}
                    <div ref={ref}>
                        <HeaderLanguage language={language} onClick={toggleUserMenu} />
                    </div>
                    <HeaderUserMenu
                        onClose={onOutsideClick}
                        visible={userMenuVisible}
                    />
                </Right>
            </Inner>

            <SimpleProfile type='header' categoryVisible={false} />
        </Wrapper>
    );
}

const Wrapper = Styled.div`
    margin-top: 1rem;
    width: 100%;
`;

const Inner = Styled(MainResponsive)`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Right = Styled.div`
    display: flex;
    align-items: center;
    position: relative;
    .write-button {
        ${media.medium} {
            display: none;
        }
    }
`;

const SearchButton = Styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    width: 2.5rem;
    height: 2.5rem;
    outline: none;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
        background: rgba(0, 0, 0, 0.045);
    }
    svg {
        color: black;
        width: 1.125rem;
        height: 1.125rem;
    }
    margin-right: 0.75rem;
`;

export default memo(Header);