import React from "react";
import { Box, Divider, Link, Stack, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const FooterComponent = () => {
	const navigate = useNavigate();

	const FastLink = styled(Link)(({ theme }) => ({
		color: theme.palette.text.primary,
		textDecoration: "none",
		padding: "7px 0",
	}));

	return (
		<Box p={2} bgcolor={"white"}>
			<Stack
				sx={{
					flexDirection: { xs: "column", md: "row" },
					alignItems: "start",
				}}
			>
				<Box flex={2}>
					<div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
						<img src="spriyo.png" alt="logo" height={36} />
					</div>
					<br />
					<Typography variant="body2">
						Please contact us if you have any specific idea or request
					</Typography>
					<Link href="mailto:contact@spriyo.xyz">contact@spriyo.com</Link>
				</Box>
				<Box flex={1} sx={{ display: { xs: "none", md: "block" } }}>
					<Stack>
						<Typography variant="h2">Marketplace</Typography>
						<FastLink href="#">All NFt</FastLink>
						<FastLink href="#">Create</FastLink>
						<FastLink href="#">Trending</FastLink>
						<FastLink href="#">Popular creators</FastLink>
					</Stack>
				</Box>
				<Box flex={1} sx={{ display: { xs: "none", md: "block" } }}>
					<Stack>
						<Typography variant="h2">Account</Typography>
						<FastLink href="#">Profile</FastLink>
						<FastLink href="#">Favorites</FastLink>
						<FastLink href="#">Wishlist</FastLink>
						<FastLink href="#">Wallet</FastLink>
						<FastLink href="#">Collections</FastLink>
					</Stack>
				</Box>
				<br />
				<Box flex={1}>
					<Typography variant="h2">Community</Typography>
					<Stack direction={"row"}>
						<FastLink
							target={"_blank"}
							href="https://instagram.com/spriyo.xyz"
							mr={2}
						>
							<img src="instagram.png" alt="instagram" />
						</FastLink>
						<FastLink href="#" mr={2}>
							<img src="twitter.png" alt="twitter" />
						</FastLink>
						<FastLink href="#" mr={2}>
							<img src="discord.png" alt="Discord" />
						</FastLink>
					</Stack>
				</Box>
			</Stack>
			<br />
			<Divider />
			<br />
			<Typography variant="h5">&copy; 2022 Spriyo</Typography>
		</Box>
	);
};
