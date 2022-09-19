import React from "react";
import { Box, Link, Stack, styled, Typography } from "@mui/material";
import { BoxShadow } from "../components/BoxShadow";
import CreateScreenVideo from "../assets/create-screen-video.mp4";
import { useDispatch } from "react-redux";
import { AuthHttpService } from "../api/auth";
import logo from "../assets/spriyo.png";
import discordLogo from "../assets/discord.png";
import twitterLogo from "../assets/twitter.png";
import instagramLogo from "../assets/instagram.png";
import WalletConnectLogo from "../assets/WalletConnect-Emblem.png";
import { connectWalletToSite, getWalletAddress } from "../utils/wallet";
import { switchAccount } from "../state/actions/wallet";
import { login, logout } from "../state/actions/auth";
import { addNotification } from "../state/actions/notifications";
import { useNavigate } from "react-router-dom";

export const Connect = () => {
	const FastLink = styled(Link)(({ theme }) => ({
		color: theme.palette.text.primary,
		textDecoration: "none",
	}));

	const authHttpService = new AuthHttpService();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function connectAndListenWallet() {
		try {
			const walletConnected = await connectWalletToSite();
			if (walletConnected) {
				let walletAddress = await getWalletAddress();

				// Login to account if not logged
				const token = localStorage.getItem("token");
				if (!token) {
					const authResponse = await authHttpService.signIn();
					dispatch(switchAccount(walletAddress));
					dispatch(login({ user: authResponse.user }));
				}
				navigate("/");

				// Listeners
				window.ethereum.on("accountsChanged", async function (accounts) {
					// Signout of current account
					authHttpService.signOut();
					dispatch(logout());

					// Signin to new account
					const authResponse = await authHttpService.signIn();
					dispatch(login({ user: authResponse.user }));
					dispatch(switchAccount(accounts[0]));
				});

				window.ethereum.on("chainChanged", async function (networkId) {
					dispatch(
						addNotification(
							"If you've switched to test network, you can use dev.spriyo.xyz for testing.",
							"Open Site",
							1,
							() => {
								window.open("https://dev.spriyo.xyz");
							}
						)
					);
				});
			} else {
				alert(
					"Non-Ethereum browser detected. You should consider trying MetaMask!"
				);
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function fetchCurrentUser() {
		let response = await authHttpService.getUser();
		if (!response.error) {
			dispatch(login({ user: response.data }));
		}
	}

	return (
		<Box minHeight="100vh" minWidth="100vw">
			<Box sx={{ zIndex: "-1", backgroundColor: "#989898" }}>
				<video
					autoPlay
					muted
					loop
					style={{
						position: "fixed",
						right: 0,
						bottom: 0,
						minWidth: "100%",
						minHeight: "100%",
					}}
				>
					<source src={CreateScreenVideo} type="video/mp4" />
				</video>
			</Box>
			<Box
				sx={{
					zIndex: "1",
					position: "fixed",
					display: "flex",
					alignItems: "center",
					justifyContent: { xs: "center", md: "start" },
					height: "100%",
					width: "100%",
					left: { xs: "0", md: "64px" },
				}}
			>
				<Box
					sx={{
						height: "90vh",
						width: { xs: "85vw", sm: "50vw", md: "35vw" },
						backgroundColor: "white",
						borderRadius: "16px",
						p: 2,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
					}}
				>
					<Box>
						<img src={logo} alt="logo" height={36} />
						<br />
						<br />
						<Typography variant="h1" fontSize="34px" fontWeight="bolder">
							CONNECT YOUR
						</Typography>
						<Typography variant="h1" fontSize="34px" fontWeight="bolder">
							WALLET
						</Typography>
						<Typography variant="h3" color="text.primary">
							Choose how you want to connect. There are several wallet
							providers.
						</Typography>
						<br />
						<Typography variant="h5" color="text.primary">
							Popular
						</Typography>
						<BoxShadow>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									borderRadius: "8px",
									p: 1,
								}}
								onClick={() => {
									connectAndListenWallet();
									fetchCurrentUser();
								}}
							>
								<img
									src="https://mumbai.polygonscan.com/images/svg/brands/metamask.svg"
									alt="metamask logo"
									height={"40px"}
								/>
								&nbsp;
								<Typography variant="h5" color="black">
									MetaMask
								</Typography>
							</Box>
						</BoxShadow>
						<br />
						<Typography variant="h5" color="text.primary">
							Coming Soon
						</Typography>
						<BoxShadow>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									borderRadius: "8px",
									p: 1,
								}}
							>
								<img
									src={WalletConnectLogo}
									alt="walletconnect logo"
									height={"40px"}
								/>
								&nbsp;
								<Typography variant="h5" color="black">
									Wallet Connect
								</Typography>
							</Box>
						</BoxShadow>
					</Box>
					{/* Socials */}
					<div
						className="sidenav-footer"
						style={{ borderTop: "1px solid #ddddeb" }}
					>
						<Stack direction={"row"}>
							<FastLink
								target={"_blank"}
								href="https://instagram.com/spriyo.xyz"
							>
								<img src={instagramLogo} alt="instagram" />
							</FastLink>
							<FastLink href="https://discord.gg/pY3p7UNDd6">
								<img src={discordLogo} alt="Discord" />
							</FastLink>
							<FastLink href="https://twitter.com/spriyomarket">
								<img src={twitterLogo} alt="twitter" />
							</FastLink>
						</Stack>
						<div>
							<p>© 2022 Spriyo</p>
						</div>
					</div>
				</Box>
			</Box>
		</Box>
	);
};
