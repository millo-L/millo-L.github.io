import React, { memo } from 'react';
import Styled from 'styled-components';
import media from '../../lib/styles/media';
import palette from '../../lib/styles/palette';

const TagItemWrapper = Styled.div`
    padding: 0.5rem 1rem;
    background-color: ${palette.gray[1]};
    color: ${palette.indigo[8]};
    border-radius: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    cursor: pointer;
    &:hover {
        background-color: ${palette.gray[2]};
    }
    
    ${media.custom(1056)} {
        font-size: 0.8rem;
    }
`;

interface TagItemProps {
    tag: string;
    onClick: (tag: string) => void;
}

const TagItem = memo(({ tag, onClick }: TagItemProps) => <TagItemWrapper onClick={() => onClick(tag)}>{tag}</TagItemWrapper>);

const TagListWrapper = Styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 4rem;
`;

interface TagListWrapper {
    tags: Array<string>;
    onClick: (tag: string) => void;
}

const TagList = ({ tags, onClick }: TagListWrapper) => {
    return (
        <TagListWrapper>
            {tags.map((tag, index) => {
                return <TagItem tag={tag} key={index} onClick={onClick} />
            })}
        </TagListWrapper>
    );
};

export default memo(TagList);