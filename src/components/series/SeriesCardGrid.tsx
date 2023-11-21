import React from "react";
import Styled from "styled-components";
import { mediaQuery } from "../../libs/styles/media";
import { SeriesType } from "../../types/Common";
import SeriesCard from "./SeriesCard";

const Container = Styled.div`
    display: flex;
    margin: 0 -1rem;
    flex-wrap: wrap;
    ${mediaQuery(767)} {
        margin: 0;
    }

    .adsense-block {
        width: 100%;
    }
`;

interface Props {
	seriesList: SeriesType[];
}

export default function SeriesCardGrid({ seriesList }: Props) {
	return (
		<Container>
			{seriesList.map((series) => (
				<SeriesCard series={series} key={series.title} />
			))}
		</Container>
	);
}
