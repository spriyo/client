import { Box, Stack } from "@mui/material";
import React from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import notFound from "../lottie/notFound.gif";

function NotFound() {
	return (
		<Stack>
			<NavbarComponent />
			<Box display={"flex"} flexDirection="column" alignItems="center">
				<img src={notFound} alt="Empty" style={{ height: "45vh" }} />
			</Box>
			<FooterComponent />
		</Stack>
	);
}

export default NotFound;
