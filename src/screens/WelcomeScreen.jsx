import "./WelcomeScreen.Style.css";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import PlaneScult from "../assets/planesculpt.png";
import logo from "../assets/spriyo.png";
import { useNavigate } from "react-router-dom";
import { IoChevronForwardOutline } from "react-icons/io5";

export const WelcomeScreen = () => {
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.setItem("welcome", true);
	}, []);

	return (
		<Box
			sx={{
				position: "relative",
				height: "100vh",
				width: "100vw",
				maxWidth: "100vw",
				overflow: "hidden",
			}}
		>
			<p className="emoji-design unicorn">🦄</p>
			<p className="emoji-design rocket">🚀</p>
			<p className="emoji-design heart">💖</p>
			<Box
				p={3}
				sx={{ display: "flex", flexDirection: "column", height: "100%" }}
			>
				<Box
					display="flex"
					alignItems="start"
					style={{ cursor: "pointer" }}
					onClick={() => navigate("/")}
				>
					<img src={logo} alt="logo" height={36} />
				</Box>
				<Box position={"relative"} className="content-container">
					{/* <Box className="gradient-container"></Box> */}
					<Box className="main-title">
						<p>
							Mint <span className="nft-title">NFT's</span> now
						</p>
						<p>on Shardeum🌈</p>
					</Box>
					<Box className="welcome-button-container">
						<Box className="continue-button" onClick={() => navigate("/")}>
							<p>Continue</p>
							<Box pr={1}></Box>
							<IoChevronForwardOutline />
						</Box>
						<p className="continue-button-subtitle">
							*Product in beta, things might brake😄
						</p>
					</Box>
				</Box>
			</Box>

			{/* Image */}
			<Box
				sx={{
					position: "absolute",
					bottom: { xs: -10, md: -120 },
					width: "100vw",
				}}
				className="planesculpt"
			>
				<img
					style={{
						// width: "110vw",
						width: "100%",
					}}
					src={PlaneScult}
					alt="planescultp"
				/>
			</Box>
		</Box>
	);
};
