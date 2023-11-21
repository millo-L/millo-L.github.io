const palette = {
	gray: [
		"#F8F9FA",
		"#F1F3F5",
		"#E9ECEF",
		"#DEE2E6",
		"#CED4DA",
		"#ADB5BD",
		"#868E96",
		"#495057",
		"#343A40",
		"#212529",
	],
	indigo: [
		"#edf2ff",
		"#dbe4ff",
		"#bac8ff",
		"#91a7ff",
		"#748ffc",
		"#5c7cfa",
		"#4c6ef5",
		"#4263eb",
		"#3b5bdb",
		"#364fc7",
	],
	red: [
		"#fff5f5",
		"#ffe3e3",
		"#ffc9c9",
		"#ffa8a8",
		"#ff8787",
		"#ff6b6b",
		"#fa5252",
		"#f03e3e",
		"#e03131",
		"#c92a2a",
	],
};

export const buttonColorMap: {
	[color: string]: {
		background: string;
		color: string;
		hoverBackground: string;
	};
} = {
	indigo: {
		background: palette.indigo[6],
		color: "white",
		hoverBackground: palette.indigo[5],
	},
	lightGray: {
		background: palette.gray[2],
		color: palette.gray[7],
		hoverBackground: palette.gray[1],
	},
	gray: {
		background: palette.gray[6],
		color: "white",
		hoverBackground: palette.gray[5],
	},
	darkGray: {
		background: palette.gray[8],
		color: "white",
		hoverBackground: palette.gray[6],
	},
	transparent: {
		background: "none",
		color: palette.indigo[6],
		hoverBackground: palette.indigo[1],
	},
	red: {
		background: palette.red[5],
		color: "white",
		hoverBackground: palette.red[4],
	},
};

export default palette;
