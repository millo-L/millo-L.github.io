import React, { memo } from "react"
import styled from "styled-components"
import media from "../../lib/styles/media"

export type HomeLayoutProps = {
    children: React.ReactNode
}

function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <Wrapper>
            <Main>{children}</Main>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    width: 80%;
    margin-top: 2rem;

    ${media.custom(1056)} {
        width: 100%;
    }
`
const Main = styled.main`
    flex: 1;
`

export default memo(HomeLayout)
