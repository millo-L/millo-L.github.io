import React from "react"
import Styled from "styled-components"

const Wrapper = Styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
`

interface MainPageRowTemplateProps {
    children: React.ReactNode
}

const MainPageRowTemplate = ({ children }: MainPageRowTemplateProps) => {
    return <Wrapper>{children}</Wrapper>
}

export default MainPageRowTemplate
