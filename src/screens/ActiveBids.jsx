import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Web3 from "web3";
import { AuctionHttpService } from "../api/auction";
import { BoxShadow } from "../components/BoxShadow";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { VscLinkExternal } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export const ActiveBids = () => {
	const [bids, setBids] = useState([]);
	const auctionHttpService = new AuctionHttpService();
	const navigate = useNavigate();

	async function getBids() {
		try {
			const resolved = await auctionHttpService.getBids();
			if (!resolved.error) {
				setBids(resolved.data);
			}
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	}

	useEffect(() => {
		getBids();
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				justifyContent: "start",
			}}
		>
			<NavbarComponent />
			<Box
				sx={{
					flexGrow: 1,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography variant="h2">Active Bids</Typography>
				<br />
				{bids.map((bid) => {
					return (
						<BoxShadow>
							<Stack
								flexDirection={"row"}
								p={1}
								paddingX={2}
								width={"75vw"}
								onClick={() =>
									navigate(
										`/assets/${bid.auction.asset.contract_address}/${bid.auction.asset.token_id}`
									)
								}
							>
								<Box sx={{ borderRadius: "8px" }}>
									<img
										src={bid.auction.asset.image}
										alt={bid.auction.asset.name}
										width="75px"
										height="75px"
									/>
								</Box>
								&nbsp; &nbsp;
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										width: "100%",
										alignItems: "center",
									}}
								>
									<Stack
										flexDirection={"column"}
										justifyContent="space-evenly"
										height="100%"
									>
										<Box>
											<Typography variant="h3">
												{bid.auction.asset.name}&nbsp;
												<span
													style={{
														fontSize: "10px",
														fontWeight: "medium",
														color: "grey",
													}}
												>
													ERC{bid.auction.asset.type}
												</span>
											</Typography>
											<Typography variant="h5">
												{Web3.utils.fromWei(bid.amount)} SHM
											</Typography>
										</Box>
										<Typography variant="h6" color="text.secondary">
											{`${new Date(bid.createdAt).toDateString()}, ${new Date(
												bid.createdAt
											).toLocaleTimeString()}`}
										</Typography>
									</Stack>
									<Box>
										<VscLinkExternal />
									</Box>
								</Box>
							</Stack>
						</BoxShadow>
					);
				})}
			</Box>
			<FooterComponent />
		</Box>
	);
};
