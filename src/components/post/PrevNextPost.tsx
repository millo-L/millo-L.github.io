import React, { useMemo } from "react";
import styled from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import { SeriesPostType } from "../../types/Common";
import PrevNextPostItem from "./PrevNextPostItem";

const Container = styled.div`
	width: 100%;
	display: flex;
	align-items: space-between;
	justify-content: space-between;
	margin: auto;
	${mediaQuery(767)} {
		flex-direction: column-reverse;
	}
`;

const ItemContainer = styled.div`
	width: 300px;

	${mediaQuery(767)} {
		width: 100%;
		& + & {
			margin-bottom: 1.5rem;
		}
	}
`;

interface Props {
	nowPostTitle: string;
	seriesPosts: SeriesPostType[];
	lang: string;
}

export default function PrevNextPost({ nowPostTitle, seriesPosts, lang }: Props) {
	const len = seriesPosts.length;
	const index = useMemo(
		() => seriesPosts.findIndex((post) => post.title === nowPostTitle),
		[nowPostTitle, seriesPosts],
	);

	return (
		<Container>
			<ItemContainer>
				<PrevNextPostItem
					seriesPost={index > 0 ? seriesPosts[index - 1] : null}
					right={false}
					lang={lang}
				/>
			</ItemContainer>
			<ItemContainer>
				<PrevNextPostItem
					seriesPost={index < len - 1 ? seriesPosts[index + 1] : null}
					right
					lang={lang}
				/>
			</ItemContainer>
		</Container>
	);
}
