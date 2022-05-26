import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { ChainsConfig } from "../constants";
import { switchChain } from "../utils/wallet";

export const BlogScreen = () => {
	function handleClick() {
		switchChain(ChainsConfig.SHARDEUM_LIBERTY);
	}

	return (
		<Stack>
			<NavbarComponent />
			<Box
				display={"flex"}
				flexDirection="column"
				alignItems="center"
				height={"55vh"}
			>
				<Typography variant="h2">Add Shardeum to metamask</Typography>
				<br />
				<Chip
					avatar={
						<img
							src="https://mumbai.polygonscan.com/images/svg/brands/metamask.svg"
							alt="metamask logo"
						></img>
					}
					label="Add Shardeum Liberty"
					onClick={handleClick}
				>
					Add Shardeum Liberty
				</Chip>
			</Box>
			<FooterComponent />
		</Stack>
	);
};
