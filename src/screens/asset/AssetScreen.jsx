import "./asset.css";
import React, { useEffect, useState } from "react";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import {
	Box,
	Chip,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import { FooterComponent } from "../../components/FooterComponent";
import { useNavigate, useParams } from "react-router-dom";
import { AssetHttpService } from "../../api/asset";
import { BiLinkExternal } from "react-icons/bi";
import { ChainsConfig } from "../../constants";
import { useSelector } from "react-redux";
import { ActionsComponent } from "../../components/ActionsComponent";
import { ActivityCardComponent } from "../../components/activityCard/ActivityCard";
import { CircularProfile } from "../../components/CircularProfileComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { getNetworkByChainId } from "../../utils/getNetwork";
import { getChainId, getWalletAddress, switchChain } from "../../utils/wallet";

export function AssetScreen() {
	const { id } = useParams();
	const [asset, setAsset] = useState(null);
	const assetHttpService = new AssetHttpService();
	const chainId = useSelector((state) => state.walletReducer.chainId);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const nftContract = useSelector((state) => state.contractReducer.nftContract);
	const [loading, setLoading] = useState(false);
	// const TagChip = styled(Chip)({
	// 	margin: "4px",
	// });

	const getAsset = async function () {
		const resolved = await assetHttpService.getAssetById(id);
		if (!resolved.error) {
			const fetchedAsset = resolved.data;
			setAsset(fetchedAsset);
			if (
				fetchedAsset.events.length !== 0 &&
				(fetchedAsset.events[0].event_type === "bid" ||
					fetchedAsset.events[0].event_type === "auction_create")
			) {
				getCurrentAuction(fetchedAsset.events);
			}
		}
	};

	function getCurrentAuction(events) {
		// const currentAuction = events.find(
		// 	(event) => event.event_type === "auction_create"
		// );
	}

	function handleExploreClick() {
		const cid = chainId;
		let chain;
		for (const c in ChainsConfig) {
			if (cid === ChainsConfig[c].chainId) {
				chain = ChainsConfig[c];
			}
		}
		const url = `${chain.blockExplorerUrls[0]}token/${asset.contract_address}?a=${asset.item_id}`;
		window.open(url);
	}

	async function checkApproval() {
		let isApproved = false;
		try {
			// Check for approval
			const owner = await nftContract.methods.ownerOf(asset.item_id).call();
			if (asset.owner.address !== owner.toLowerCase()) {
				alert(
					"Cancel all the auctions or sales on this NFT before transfering."
				);
			} else {
				isApproved = true;
			}
		} catch (error) {
			console.log(error.message);
		}
		return isApproved;
	}

	async function approveMiddleware(callback) {
		try {
			if (!asset) return;
			const chain = await getNetworkByChainId(parseInt(asset.chainId));
			const currentChainId = await getChainId();
			if (chain.chainId !== currentChainId) {
				await switchChain(chain);
			}

			setLoading(true);
			const isApproved = await checkApproval();
			if (!isApproved) return setLoading(false);
			await callback();
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	async function transferNFT() {
		const currentAddress = await getWalletAddress();
		const toAddresss = await prompt(
			"Please enter the address, NFT's sent to invalid address is lost forever!"
		);
		if (!toAddresss) return;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await nftContract.methods
			.transferFrom(currentAddress, toAddresss, asset.item_id)
			.estimateGas({
				from: currentAddress,
			});
		await nftContract.methods
			.transferFrom(currentAddress, toAddresss, asset.item_id)
			.send({ from: currentAddress, gasPrice, gas });

		// Create An Event in Backend
		const resolved = await assetHttpService.transferAsset({
			...asset,
			userId: toAddresss,
		});
		if (!resolved.error) {
			window.location.reload();
		}
	}

	useEffect(() => {
		getAsset();
	}, []);

	return (
		<Box sx={{ backgroundColor: "#efeff8" }}>
			<Box>
				<NavbarComponent />
			</Box>
			{asset ? (
				<Box sx={{ margin: { xs: "12px", md: "24px 40px" } }}>
					<Box p={2} bgcolor="white" borderRadius="10px">
						<Stack
							sx={{
								flexDirection: { xs: "column", md: "row" },
								height: { xs: "auto", md: "80vh" },
							}}
						>
							{/* Image */}
							<Box
								flex={1}
								overflow="auto"
								height="auto"
								display={"flex"}
								justifyContent="center"
								borderRadius={"10px"}
								onClick={() =>
									window.open(asset.image || asset.medias[0].path, "_blank")
								}
								m={1}
							>
								<img
									src={asset.image || asset.medias[0].path}
									alt="nft"
									width="100%"
									height="auto"
									className="main-image"
								/>
							</Box>
							{/* Details */}
							<Box flex={1} m={1}>
								<Box display="flex" justifyContent={"space-between"}>
									<Box>
										<Typography variant="h1">{asset.name}</Typography>
										<Typography
											variant="subtitle2"
											color={"text.secondary"}
											component="p"
										>
											NFT ID : {asset.item_id}
										</Typography>
									</Box>
									{user && asset && user._id === asset.owner._id ? (
										<ButtonComponent
											text={loading ? "Transfering..." : "Transfer ▶️"}
											onClick={() => {
												if (loading) return;
												approveMiddleware(transferNFT);
											}}
										/>
									) : (
										""
									)}
								</Box>
								<Typography
									variant="body2"
									color={"text.secondary"}
									component="p"
								>
									Owner
								</Typography>
								<ListItem
									onClick={() => navigate(`/${asset.owner.username}`)}
									sx={{ cursor: "pointer" }}
								>
									<ListItemAvatar>
										<CircularProfile
											userId={asset.owner._id}
											userImgUrl={asset.owner.displayImage}
										/>
									</ListItemAvatar>
									{user ? (
										<ListItemText
											primary={asset.owner.displayName}
											secondary={`@${
												asset.owner.username.length > 20
													? `${asset.owner.username.substring(
															0,
															4
													  )}...${asset.owner.username.slice(-4)}`
													: asset.owner.username
											}`}
										/>
									) : (
										""
									)}
								</ListItem>
								{asset.events.length === 0 ? (
									<Typography variant="body1">No Activity</Typography>
								) : (
									<Box>
										<ActionsComponent asset={asset} />
										{/* Activity */}
										<Typography variant="h3" component="p">
											Activity
										</Typography>
										<Box>
											{asset.events.slice(0, 2).map((e, i) => (
												<Box key={i}>
													<ActivityCardComponent event={e} asset={asset} />
												</Box>
											))}
										</Box>
									</Box>
								)}
							</Box>
						</Stack>
					</Box>
					<br />
					{/* Meta Details */}
					<Box>
						<Typography variant="h1">Description</Typography>
						<Typography variant="body1">{asset.description}</Typography>
						{/* <br />
						<Typography variant="h1">Tags</Typography>
						<TagChip label="Meta"></TagChip>
						<TagChip label="Metaverse"></TagChip>
						<TagChip label="Drawing"></TagChip>
						<TagChip label="Painting"></TagChip>
						<TagChip label="Pencil"></TagChip> */}
						{/* Meta */}
						<br />
						<br />
						<Typography variant="h1">Details</Typography>
						<Chip
							label="View on Explorer"
							onClick={handleExploreClick}
							icon={<BiLinkExternal />}
							style={{ fontWeight: 600 }}
						/>
					</Box>
				</Box>
			) : (
				<Box
					height="50vh"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					{/* <p>loading</p> */}
				</Box>
			)}
			<FooterComponent />
		</Box>
	);
}
