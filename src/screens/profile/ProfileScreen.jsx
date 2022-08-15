import { Box } from "@mui/material";
import React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import LoadingImage from "../../assets/loading-image.gif";
import { useEffect, useState } from "react";
import { AssetHttpService } from "../../api/asset";
import { FooterComponent } from "../../components/FooterComponent";
import "./ProfileScreen.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { SettingComponent } from "../../components/SettingComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { CardComponent } from "../../components/card/CardComponent";
import { AuthHttpService } from "../../api/auth";
import { EmptyNftComponent } from "../../components/EmptyNftComponent";
// import { MoralisHttpService } from "../../api/moralis";
const { NavbarComponent } = require("../../components/navBar/NavbarComponent");

export function ProfileScreen(params) {
	const assetHttpService = new AssetHttpService();
	const authHttpService = new AuthHttpService();
	const [assets, setAssets] = useState([]);
	// const [polygonAssets, setPolygonAssets] = useState([]);
	// const [binanceAssets, setBinanceAssets] = useState([]);
	// const [ethereumAssets, setEthereumAssets] = useState([]);
	const [loggedUser, setLoggedUserUser] = useState({});
	const [user, setUser] = useState({});
	const { id } = useParams();
	const [nftLoading, setNftLoading] = useState(false);
	// const [nftBinanceLoading, setNftBinanceLoading] = useState(false);
	// const [nftEthereumLoading, setNftEthereumLoading] = useState(false);
	// const [nftPolygonLoading, setNftPolygonLoading] = useState(false);
	// const moralisHttpService = new MoralisHttpService();

	async function getUserAssets() {
		setNftLoading(true);
		const localUser = await JSON.parse(localStorage.getItem("user"));
		setLoggedUserUser(localUser ? localUser : {});
		const resolved = await assetHttpService.getUserAssets(id);
		setAssets(resolved.data);
		setNftLoading(false);
	}

	async function getUser() {
		const resolved = await authHttpService.getUserById(id);
		setUser(resolved.data);
	}

	const [open, setOpen] = useState(false);

	const handleClose = (value) => {
		setOpen(false);
	};

	const [value, setValue] = React.useState("1");

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// const fetchBinanceNFTs = async () => {
	// 	setNftBinanceLoading(true);
	// 	const resolved = await moralisHttpService.getNfts("bsc");
	// 	if (!resolved.error) {
	// 		const data = resolved.data.result
	// 			.filter((a) => a.metadata)
	// 			.map((a) => JSON.parse(a.metadata));
	// 		setBinanceAssets(data);
	// 	}
	// 	setNftBinanceLoading(false);
	// };

	// const fetchEthereumNFTs = async () => {
	// 	setNftEthereumLoading(true);
	// 	const resolved = await moralisHttpService.getNfts("eth");
	// 	if (!resolved.error) {
	// 		const data = resolved.data.result
	// 			.filter((a) => a.metadata)
	// 			.map((a) => JSON.parse(a.metadata));
	// 		setEthereumAssets(data);
	// 	}
	// 	setNftEthereumLoading(false);
	// };

	// const fetchPolygonNFTs = async () => {
	// 	setNftPolygonLoading(true);
	// 	const resolved = await moralisHttpService.getNfts("matic");
	// 	if (!resolved.error) {
	// 		const data = resolved.data.result
	// 			.filter((a) => a.metadata)
	// 			.map((a) => JSON.parse(a.metadata));
	// 		setPolygonAssets(data);
	// 	}
	// 	setNftPolygonLoading(false);
	// };

	useEffect(() => {
		getUserAssets();
		getUser();
		// fetchBinanceNFTs();
		// fetchEthereumNFTs();
		// fetchPolygonNFTs();
	}, [id]);

	return (
		<div className="profile-container">
			<NavbarComponent></NavbarComponent>
			<Box
				className="profile-header"
				sx={{ display: "flex", justifyContent: "center" }}
			>
				<div className="banner-image"></div>
				<Box
					className="profile-details"
					sx={{
						width: { xs: "auto", md: "40vw" },
						left: { xs: "auto", md: "60px" },
					}}
				>
					{user.displayImage && (
						<div
							className="profile-details-image"
							style={{
								backgroundImage: `url(${
									user.displayImage.includes("default-profile-icon")
										? `https://joeschmoe.io/api/v1/${user._id}`
										: user.displayImage
								})`,
							}}
						></div>
					)}
					<Box display="flex" height="100%" alignItems="center">
						<div>
							{user.displayName && (
								<p style={{ fontWeight: "bold" }}>{user.displayName}</p>
							)}
							{user.username && (
								<p style={{ fontWeight: "medium" }}>
									@
									{user.username.length > 20
										? `${user.username.substring(0, 4)}...${user.username.slice(
												-4
										  )}`
										: user.username}
								</p>
							)}
						</div>
						{loggedUser._id === user._id && (
							<Box sx={{ position: "absolute", top: "16px", right: "16px" }}>
								<Box
									display="flex"
									alignItems="center"
									onClick={() => setOpen(true)}
									sx={{ cursor: "pointer" }}
								>
									<Box display="flex" alignItems="center" marginRight="4px">
										<MdOutlineModeEditOutline size="20" />
									</Box>
								</Box>
								<SettingComponent open={open} onClose={handleClose} />
							</Box>
						)}
					</Box>
					{/* <div>
						<div className="assset-value">
							<div>
								<p>5</p>
								<p>Collection</p>
							</div>
							<div>
								<p>38.98 ETH</p>
								<p>Total Sales</p>
							</div>
							<div>
								<p>2</p>
								<p>Owned</p>
							</div>
							<div>
								<p>38.98 ETH</p>
								<p>Floor Price</p>
							</div>
						</div>
					</div> */}
				</Box>
			</Box>
			{/* Description
			<div className="profile-description">
				<h2>Description</h2>
				<p>
					BearX is a limited NFT collection of Genesis and Mini Bears created on
					Ethereum blockchain.
				</p>
			</div> */}
			<Box
				p={2}
				borderRadius={"4px"}
				style={{ margin: "16px", backgroundColor: "white" }}
			>
				<Typography variant="h1">NFT's</Typography>
				<Box mb={2}></Box>
				<TabContext value={value}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList onChange={handleChange}>
							<Tab label="Binance" value="1" />
							<Tab label="Ethereum" value="2" />
							<Tab label="Polygon" value="3" />
							<Tab label="Spriyo" value="4" />
						</TabList>
					</Box>
					{/* <TabPanel value="1">
						<NFTList
							nftLoading={nftBinanceLoading}
							assets={binanceAssets}
							isAuthenticated={loggedUser._id === user._id}
						/>
					</TabPanel>
					<TabPanel value="2">
						<NFTList
							nftLoading={nftEthereumLoading}
							assets={ethereumAssets}
							isAuthenticated={loggedUser._id === user._id}
						/>
					</TabPanel>
					<TabPanel value="3">
						<NFTList
							nftLoading={nftPolygonLoading}
							assets={polygonAssets}
							isAuthenticated={loggedUser._id === user._id}
						/>
					</TabPanel> */}
					<TabPanel value="4">
						<NFTList
							nftLoading={nftLoading}
							assets={assets}
							isAuthenticated={loggedUser._id === user._id}
							thirdParty={false}
						/>
					</TabPanel>
				</TabContext>
			</Box>
			<div style={{ marginBottom: "64px" }}>.</div>
			<FooterComponent />
		</div>
	);
}

export const NFTList = ({
	nftLoading = true,
	assets = [],
	isAuthenticated = false,
	thirdParty = true,
}) => {
	const navigate = useNavigate();

	return nftLoading ? (
		<p>loading</p>
	) : assets.length === 0 ? (
		<EmptyNftComponent currentUser={isAuthenticated} />
	) : (
		<InfiniteScroll
			dataLength={assets.length}
			next={() => {}}
			hasMore={true}
			loader={<p></p>}
			style={{ overflowX: "clip" }}
		>
			<Grid
				container
				spacing={{ xs: 2, md: 3 }}
				columns={{ xs: 4, sm: 8, md: 12 }}
			>
				{assets.map((a, i) => (
					<Grid item xs={12} sm={4} md={4} key={i}>
						{!thirdParty ? (
							<Box onClick={() => navigate("/asset/" + a._id)}>
								<CardComponent asset={a} />
							</Box>
						) : (
							<NftCard asset={a} />
						)}
					</Grid>
				))}
			</Grid>
		</InfiniteScroll>
	);
};

const NftCard = ({ asset }) => {
	const [image, setImage] = useState("");

	useEffect(() => {
		if (asset.image) {
			const IPFS_REGEX = /^ipfs:\/\//gm;
			const match = asset.image.match(IPFS_REGEX);
			if (match && match.length > 0) {
				asset.image = asset.image.replace("ipfs://", "https://ipfs.io/ipfs/");
			}
			setImage(asset.image);
		}
	}, [asset, image]);

	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardMedia
				component="img"
				alt="nft-image"
				height="180"
				image={image === "" ? LoadingImage : image}
				onError={({ currentTarget }) => {
					currentTarget.onerror = null; // prevents looping
					currentTarget.src =
						"https://ehelperteam.com/wp-content/uploads/2019/09/Broken-images.png";
				}}
			/>
			<CardContent>
				<Typography gutterBottom variant="h5" component="div">
					{asset.name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{asset.description
						? asset.description.length > 50
							? asset.description.slice(0, 50) + "..."
							: asset.description
						: ""}
				</Typography>
			</CardContent>
		</Card>
	);
};
