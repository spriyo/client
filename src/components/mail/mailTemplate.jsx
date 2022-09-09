import { Box, Link, Stack, styled } from "@mui/material";

import "./mailTemplate.css";

// images
import logo from "../../assets/spriyo.png";
import instagramLogo from "../../assets/instagram.png";
import discordLogo from "../../assets/discord.png";
import twitterLogo from "../../assets/twitter.png";

function MailTemplate() {
	const FastLink = styled(Link)(({ theme }) => ({
		color: theme.palette.text.primary,
		textDecoration: "none",
	}));

	return (
		<div className="mail-template-container">
			<div className="mail-template-container-inner">
				{/* Heading */}
				<Box display={"flex"} sx={{ my: 2 }} justifyContent="center">
					<img src={logo} alt="logo" height={46} />
				</Box>
				<Box sx={{ px: 3, backgroundColor: " #EDEDED;" }}>
					{/* <hr /> */}
					{/* Content */}
					<Box sx={{ height: "55vh" }}></Box>
					{/* <hr /> */}
					<div className="mail-divider-line"></div>
					{/* mail footer */}

					<Box
						sx={{
							display: "flex",
							width: "100%",
							fontWeight: 500,
							fontSize: "14px",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Box
							sx={{
								color: "#00C775",
								fontSize: "20px",
								fontWeight: "700",
							}}
						>
							Stay Connected
						</Box>
						{/*  */}
						<Stack
							direction={"row"}
							sx={{ width: "20%", justifyContent: "space-around", mt: 2 }}
						>
							<FastLink
								target={"_blank"}
								href="https://instagram.com/spriyo.xyz"
							>
								<img src={instagramLogo} alt="instagram" />
							</FastLink>
							<FastLink href="https://twitter.com/spriyomarket">
								<img src={twitterLogo} alt="twitter" />
							</FastLink>
							<FastLink href="https://discord.gg/pY3p7UNDd6">
								<img src={discordLogo} alt="Discord" />
							</FastLink>
						</Stack>
						{/*  */}
						<Box
							sx={{
								my: 1,
								display: "flex",
							}}
						>
							<Box sx={{ mr: 2 }}>Privacy Policy</Box>
							<Box>Terms of use</Box>
						</Box>

						<Box
							sx={{
								mb: 2,
							}}
						>
							© 2022 Spriyo.xyz, All Rights Reserved.
						</Box>
					</Box>
				</Box>
			</div>
		</div>
	);
}

export default MailTemplate;
