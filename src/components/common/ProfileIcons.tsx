import React, { memo } from "react"
import Styled from "styled-components"
import { SiNotion } from "react-icons/si"
import { AiFillGithub } from "react-icons/ai"
import { MdEmail } from "react-icons/md"

const IconWrapper = Styled.div`
`

const openNewBrowser = (type: "github" | "notion" | "email") => {
    let link: string
    if (type === "github") link = "https://github.com/millo-L"
    else if (type === "notion")
        link =
            "https://www.notion.so/Seungmin-Lee-706a5c55276c4ff58f1ff87d433bb4fb"
    else link = "mailto:seungmin3837@gmail.com"

    window.open(link, "_blank")
}

interface ProfileIconsProps {
    className?: string
}

const ProfileIcons = ({ className }: ProfileIconsProps) => {
    return (
        <IconWrapper className={className}>
            <AiFillGithub onClick={() => openNewBrowser("github")} />
            <SiNotion onClick={() => openNewBrowser("notion")} />
            <MdEmail onClick={() => openNewBrowser("email")} />
        </IconWrapper>
    )
}

export default memo(ProfileIcons)
