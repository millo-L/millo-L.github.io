import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import useToggle from "../../libs/hooks/useToggle";
import media from "../../libs/styles/media";
import { LanguageType } from "../../types/Common";
import SimpleProfile from "../common/SimpleProfile";
import MainResponsive from "../main/MainResponsive";
import HeaderLanguage from "./HeaderLanguage";
import HeaderLogo from "./HeaderLogo";
import HeaderUserMenu from "./HeaderUserMenu";

const Container = styled.div`
	margin-top: 1rem;
	width: 100%;
`;

const Inner = styled(MainResponsive)`
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Right = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	.write-button {
		${media.medium} {
			display: none;
		}
	}
`;

// const SearchButton = styled(Link)`
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	background: transparent;
// 	border: none;
// 	width: 2.5rem;
// 	height: 2.5rem;
// 	outline: none;
// 	border-radius: 50%;
// 	cursor: pointer;
// 	&:hover {
// 		background: rgba(0, 0, 0, 0.045);
// 	}
// 	svg {
// 		color: black;
// 		width: 1.125rem;
// 		height: 1.125rem;
// 	}
// 	margin-right: 0.75rem;
// `;

interface Props {
	lang: LanguageType;
	ko_to?: string;
	en_to?: string;
}

export default function Header({ lang, ko_to, en_to }: Props) {
	const [userMenuVisible, toggleUserMenu] = useToggle(false);
	const ref = useRef<HTMLDivElement>(null);

	const onOutsideClick = useCallback(
		(e: React.MouseEvent | MouseEvent) => {
			if (!ref.current) return;
			if (ref.current.contains(e.target as any)) return;
			toggleUserMenu();
		},
		[toggleUserMenu],
	);

	return (
		<Container>
			<Inner style={{}}>
				<HeaderLogo lang={lang} />
				<Right>
					{/* <SearchButton to="/search">
						<BsSearch style={{}} />
					</SearchButton> */}
					<div ref={ref}>
						<HeaderLanguage
							language={lang === "ko" ? "한국어" : "English"}
							onClick={toggleUserMenu}
						/>
					</div>
					<HeaderUserMenu
						visible={userMenuVisible}
						ko_to={ko_to}
						en_to={en_to}
						onClose={onOutsideClick}
					/>
				</Right>
			</Inner>
			<SimpleProfile type="header" categoryVisible={false} lang={lang} />
		</Container>
	);
}
