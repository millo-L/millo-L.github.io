import React, { memo } from "react"
import Styled from "styled-components"
import { mediaQuery } from "../../lib/styles/media"
import Adsense from "../common/Adsense"
import SeriesCard, { SeriesType } from "./SeriesCard"

const Wrapper = Styled.div`
    display: flex;
    margin: -1rem;
    flex-wrap: wrap;
    ${mediaQuery(767)} {
        margin: 0;
    }

    .adsense-block {
        width: 100%;
    }
`

interface SeriseCardGridProps {
    seriesList: Array<SeriesType>
}

const SeriesCardGrid = ({ seriesList }: SeriseCardGridProps) => {
    return (
        <Wrapper>
            <div className="adsense-block">
                <Adsense
                    style={{ display: "block" }}
                    adClient="ca-pub-3926462216067158"
                    adSlot="1239423651"
                    adFormat="auto"
                    fullWidthResponsive="true"
                />
            </div>
            {seriesList.map((series, index) => (
                <SeriesCard series={series} key={index} />
            ))}
        </Wrapper>
    )
}

export default memo(SeriesCardGrid)
