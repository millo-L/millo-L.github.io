import React from 'react';
import Styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import HeaderUserMenuItem from './HeaderUserMenuItem';
import media from '../../lib/styles/media';

const HeaderUserMenuWrapper = Styled.div`
    position: absolute;
    top: 100%;
    margin-top: 0.5rem;
    right: -2px;
    .menu-wrapper {
        position: relative;
        z-index: 5;
        width: 6rem;
        background: white;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);

        .mobile-only {
        display: none;
            ${media.medium} {
                display: block;
            }
        }
    }
`;

interface HeaderUserMenuProps {
    onClose: (e: React.MouseEvent) => void;
    visible: boolean;
}

const HeaderUserMenu = ({
    onClose,
    visible,
}: HeaderUserMenuProps) => {
    if (!visible) return null;
    return (
        <OutsideClickHandler onOutsideClick={onClose}>
            <HeaderUserMenuWrapper onClick={onClose}>
                <div className="menu-wrapper">
                    <HeaderUserMenuItem>
                        한국어
                    </HeaderUserMenuItem>
                    <HeaderUserMenuItem >English</HeaderUserMenuItem>
                </div>
            </HeaderUserMenuWrapper>
        </OutsideClickHandler>
    );
};

export default HeaderUserMenu;
