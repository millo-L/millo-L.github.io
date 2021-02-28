import { Link } from 'gatsby';
import React, { memo } from 'react';
import Styled, { css } from 'styled-components';
import { categoryList } from '../../lib/styles/category';
import { mediaQuery } from '../../lib/styles/media';
import palette from '../../lib/styles/palette';

const CategoryListWrapper = Styled.div<{ visible: boolean }>`
    margin-top: 2.5rem;
    border-top: 1px solid ${palette.gray[3]};
    padding-top: 1.5rem;
    width: 12rem;
    min-width: 12rem;

    ${props =>
        props.visible
            ? css``
            : css` display: none; `
    }

    p {
        margin: 0;
        font-size: 1.3rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .img-wrapper {
        display: flex;
        flex-wrap: wrap;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        justify-content: space-between;
        align-items: space-between;
    }

    .category-img {
        height: 1.5rem;
        max-width: 5.5rem;
        margin: 0;
        border-radius: 0;
    }

    ${mediaQuery(1440)} {
        width: 100%;
    }

    ${mediaQuery(1056)} {
        display: none;
    }
`;

interface CategoryListProps {
    visible: boolean;
    lang: string;
    selectedCategory?: string;
}

const CategoryList = ({ visible, lang, selectedCategory }: CategoryListProps) => {
    return (
        <CategoryListWrapper visible={visible}>
            <p>Categories</p>
            <div className="img-wrapper">
                {categoryList.filter((category, idx) => idx < 13).map((category, index) => {
                    return (
                        <Link to={lang === 'ko' ? `/?category=${category.name}` : `/en?category=${category.name}`} key={index} >
                            <img className="category-img"
                                src={category.src} />
                        </Link>
                    )
                })}
            </div>
        </CategoryListWrapper>
    );
}

export default memo(CategoryList);