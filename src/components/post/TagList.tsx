import React from "react";
import Styled from "styled-components";
import media from "../../libs/styles/media";
import palette from "../../libs/styles/palette";

const ItemContainer = Styled.div`
    padding: 0.5rem 1rem;
    background-color: ${palette.gray[1]};
    color: ${palette.indigo[8]};
    border-radius: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    // cursor: pointer;
    &:hover {
        // background-color: ${palette.gray[2]};
    }
    
    ${media.custom(1056)} {
        font-size: 0.8rem;
    }
`;

interface TagItemProps {
	tag: string;
	onClick: (tag: string) => void;
}

function TagItem({ tag, onClick }: TagItemProps) {
	return <ItemContainer onClick={() => onClick(tag)}>{tag}</ItemContainer>;
}

const Container = Styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 2rem;
`;

interface Props {
	tags: Array<string>;
	onClick: (tag: string) => void;
}

export default function TagList({ tags, onClick }: Props) {
	return (
		<Container>
			{tags.map((tag) => (
				<TagItem tag={tag} key={tag} onClick={onClick} />
			))}
		</Container>
	);
}
