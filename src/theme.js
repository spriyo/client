import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	typography: {
		h1: {
			fontSize: 24,
			fontWeight: 600,
		},
		h2: {
			fontSize: 20,
			fontWeight: 600,
		},
		h3: {
			fontSize: 16,
			fontWeight: 600,
		},
		h5: {
			fontSize: 14,
			fontWeight: 600,
		},
		h6: {
			fontSize: 12,
			fontWeight: 600,
		},
		fontFamily: ["Poppins", "sans-serif"].join(","),
	},
	shadows: [
		{ 0: "rgba(149, 157, 165, 0.2) 0px 4px 24px" },
		...Array(24).fill("none"),
	],
	palette: {
		primary: { main: "#00c775" },
		text: {
			primary: "#505050",
			secondary: "#b1b1b1",
			// custom: "black",
		},
	},
});
