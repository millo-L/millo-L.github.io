import React, { createRef, useLayoutEffect } from "react"
import Styled from "styled-components"
import { mediaQuery } from "../../lib/styles/media"

const src = "https://utteranc.es/client.js"

const Wrapper = Styled.div`
    width: 60%;
    margin-left: auto;
    margin-right: auto;

    
    ${mediaQuery(1056)} {
        width: 100%;
    }
`

interface IUtterancesProps {}

const Utterances = React.memo(({}: IUtterancesProps) => {
    const containerRef = createRef<HTMLDivElement>()

    useLayoutEffect(() => {
        const utterances = document.createElement("script")

        const attributes = {
            src,
            repo: "millo-L/millo-L.github.io",
            "issue-term": "pathname",
            label: "comment",
            theme: "github-light",
            crossOrigin: "anonymous",
            async: "true",
        }

        Object.entries(attributes).forEach(([key, value]) => {
            utterances.setAttribute(key, value)
        })

        containerRef.current.appendChild(utterances)
    }, [])

    return <Wrapper ref={containerRef} />
})

Utterances.displayName = "Utterances"

export default Utterances
