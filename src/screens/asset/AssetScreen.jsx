import "./asset.css";
import React, { useEffect, useState } from "react";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import {
	Avatar,
	Box,
	Chip,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { FooterComponent } from "../../components/FooterComponent";
import { useParams } from "react-router-dom";
import { AssetHttpService } from "../../api/asset";
import { BiLinkExternal } from "react-icons/bi";
import { ChainsConfig } from "../../constants";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { ActionsComponent } from "../../components/ActionsComponent";
import { ActivityCardComponent } from "../../components/activityCard/ActivityCard";

export function AssetScreen() {
	const { id } = useParams();
	const [asset, setAsset] = useState(null);
	const assetHttpService = new AssetHttpService();
	const chainId = useSelector((state) => state.walletReducer.chainId);
	const user = useSelector((state) => state.authReducer.user);

	const TagChip = styled(Chip)({
		margin: "4px",
	});

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
		const cid = Web3.utils.numberToHex(chainId);
		let chain;
		for (const c in ChainsConfig) {
			if (cid === ChainsConfig[c].chainId) {
				chain = ChainsConfig[c];
			}
		}
		const url = `${chain.blockExplorerUrls[0]}token/${asset.contract_address}?a=${asset.item_id}`;
		window.open(url);
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
				<Box sx={{ margin: { xs: "12px", md: "16px 32px" } }}>
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
								onClick={() => window.open(asset.medias[0].path, "_blank")}
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
								<Typography variant="h1">{asset.name}</Typography>
								<Typography
									variant="subtitle2"
									color={"text.secondary"}
									component="p"
								>
									NFT ID : {asset.item_id}
								</Typography>
								<Typography
									variant="body2"
									color={"text.secondary"}
									component="p"
								>
									Owner
								</Typography>
								<ListItem>
									<ListItemAvatar>
										<Avatar src={asset.owner.displayImage}></Avatar>
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
						<br />
						<Typography variant="h1">Tags</Typography>
						<TagChip label="Meta"></TagChip>
						<TagChip label="Metaverse"></TagChip>
						<TagChip label="Drawing"></TagChip>
						<TagChip label="Painting"></TagChip>
						<TagChip label="Pencil"></TagChip>
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
