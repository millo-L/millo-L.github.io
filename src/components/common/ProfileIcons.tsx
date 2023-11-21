import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { SiNotion } from "react-icons/si";
import styled from "styled-components";

const Container = styled.div``;

const openNewBrowser = (type: "github" | "notion" | "email") => {
	const link: string = (function getLink() {
		switch (type) {
			case "github":
				return "https://github.com/millo-L";
			case "notion":
				return "https://decorous-ferret-9a5.notion.site/Seungmin-Lee-706a5c55276c4ff58f1ff87d433bb4fb";
			default:
				return "mailto:seungmin3837@gmail.com";
		}
	})();

	window.open(link, "_blank");
};

interface Props {
	className?: string;
}

export default function ProfileIcons({ className }: Props) {
	return (
		<Container className={className}>
			<AiFillGithub onClick={() => openNewBrowser("github")} />
			<SiNotion onClick={() => openNewBrowser("notion")} />
			<MdEmail onClick={() => openNewBrowser("email")} />
		</Container>
	);
}
