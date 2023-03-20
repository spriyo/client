import {
	Box,
	Button,
	CardActionArea,
	CardActions,
	Tab,
	Tabs,
	Tooltip,
} from "@mui/material";
import React, { useRef } from "react";
import LoadingImage from "../../assets/loading-image.gif";
import { useEffect, useState } from "react";
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
import { UserHttpService } from "../../api/v2/user";
import { TabContext, TabPanel } from "@mui/lab";
import { CollectionHttpService } from "../../api/v2/collection";
import { getShortAddress } from "../../utils/addressShort";
const { NavbarComponent } = require("../../components/navBar/NavbarComponent");

export function ProfileScreen() {
	const userHttpService = new UserHttpService();
	const authHttpService = new AuthHttpService();
	const collectionHttpService = new CollectionHttpService();
	const [assets, setAssets] = useState([]);
	const [contracts, setContracts] = useState([]);
	const [loggedUser, setLoggedUserUser] = useState({});
	const [user, setUser] = useState({});
	const { username } = useParams();
	const [tabValue, setTabValue] = useState("1");
	const navigate = useNavigate();
	let skip = useRef(0);
	let addressRef = useRef(0);

	async function getUserAssets(address) {
		const localUser = await JSON.parse(localStorage.getItem("user"));
		setLoggedUserUser(localUser ? localUser : {});
		const resolved = await userHttpService.getUserNFTs(address, {
			skip: skip.current,
		});
		const nfts = resolved.data
			.filter((e) => e.nft)
			.map((e) => {
				let nft = e.nft;
				delete e.nft;
				nft.owners = [];
				nft.owners.push(e);
				return nft;
			});
		setAssets((prevnfts) => [...prevnfts, ...nfts]);
		skip.current += 10;
	}

	function handleTabChange(e, v) {
		setTabValue(v);
	}

	async function getUser() {
		const resolved = await authHttpService.getUserById(username);
		setUser(resolved.data);
		if (!resolved.error) {
			addressRef.current = resolved.data.address;
			getUserAssets(resolved.data.address);
		} else {
			navigate("/user/notfound");
		}
	}

	async function getUserContracts() {
		const resolved = await collectionHttpService.getUserContracts();
		if (!resolved.error) {
			setContracts(resolved.data);
		}
	}

	const [open, setOpen] = useState(false);

	const handleClose = (value) => {
		setOpen(false);
	};

	async function updateFollowUser() {
		const resolved = await authHttpService.updateFollowUser(user._id);
		console.log(resolved);
		// setUser(resolved.data);
		// getUserAssets(resolved.data._id);
	}

	useEffect(() => {
		getUser();
		getUserContracts();
	}, [username]);

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
					{(user.displayImage && (
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
					)) || <div className="profile-details-image"></div>}
					<Box display="flex" height="100%" alignItems="center">
						<div>
							<p style={{ fontWeight: "bold" }}>
								{user.displayName || "Unnamed"}
							</p>
							<Tooltip title={user.username || user.address} arrow>
								<span>
									<p style={{ fontWeight: "medium" }}>
										@
										{(user.username &&
											(user.username.length > 20
												? `${user.username.substring(
														0,
														4
												  )}...${user.username.slice(-4)}`
												: user.username)) ||
											getShortAddress(user.address || "")}
										<br />
										{user.following === false && (
											<Button
												variant="outlined"
												color="success"
												sx={{ mt: 1 }}
												onClick={updateFollowUser}
											>
												Follow
											</Button>
										)}
										{user.following === true && (
											<Button
												variant="outlined"
												color="error"
												sx={{ mt: 1 }}
												onClick={updateFollowUser}
											>
												Unfollow
											</Button>
										)}
									</p>
								</span>
							</Tooltip>
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
				</Box>
			</Box>
			<TabContext value={tabValue}>
				<Box p={1}>
					<Box sx={{ padding: "8px" }}>
						<Tabs value={tabValue} onChange={handleTabChange}>
							<Tab label="NFTs" value="1" />
							{loggedUser._id && <Tab label="Collections" value="2" />}
						</Tabs>
					</Box>
					<TabPanel value="1" index={0} sx={{ padding: 0 }}>
						<Box p={2} borderRadius={"4px"}>
							<NFTList
								assets={assets}
								isAuthenticated={loggedUser._id === user._id}
								thirdParty={false}
								getUserAssets={getUserAssets}
								userAddress={addressRef.current}
							/>
						</Box>
					</TabPanel>
					{loggedUser._id && (
						<TabPanel value="2" index={1}>
							<Box p={2} borderRadius={"4px"}>
								<Grid
									container
									spacing={{ xs: 2, md: 3 }}
									columns={{ xs: 4, sm: 8, md: 12 }}
								>
									{contracts.map((a, i) => (
										<Grid item xs={12} sm={4} md={4} key={i}>
											<Card sx={{ maxWidth: 345 }}>
												<CardActionArea>
													<CardMedia
														component="img"
														height="140"
														image={
															a.collection ? a.collection.image : LoadingImage
														}
														alt="col-img"
													/>
													<CardContent>
														<Typography
															gutterBottom
															variant="h5"
															component="div"
														>
															{a.collection
																? a.collection.name
																: `${a.address.substring(
																		0,
																		4
																  )}...${a.address.slice(-4)}`}
														</Typography>
														{a.collection && (
															<Typography
																variant="body2"
																color="text.secondary"
															>
																{a.collection.description}
															</Typography>
														)}
													</CardContent>
												</CardActionArea>
												<CardActions>
													<Button
														sx={{
															cursor: a.collection ? "not-allowed" : "pointer",
														}}
														size="small"
														color="primary"
														variant="contained"
														onClick={() => {
															if (!a.collection)
																navigate(
																	`/collections/create?contract_address=${a.address}`
																);
														}}
													>
														Edit
													</Button>
													<Button
														size="small"
														color="primary"
														variant="contained"
														onClick={() => {
															navigate(`/collections/${a.address}`);
														}}
													>
														Explore
													</Button>
												</CardActions>
											</Card>
										</Grid>
									))}
								</Grid>
							</Box>
						</TabPanel>
					)}
				</Box>
			</TabContext>
			<div style={{ marginBottom: "64px" }}>.</div>
			<FooterComponent />
		</div>
	);
}

export const NFTList = ({
	assets = [],
	isAuthenticated = false,
	thirdParty = true,
	getUserAssets,
	userAddress,
}) => {
	const navigate = useNavigate();

	return assets.length === 0 ? (
		<EmptyNftComponent currentUser={isAuthenticated} />
	) : (
		<InfiniteScroll
			dataLength={assets.length}
			next={() => getUserAssets(userAddress)}
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
							<Box
								onClick={() =>
									navigate(`/assets/${a.contract_address}/${a.token_id}`)
								}
							>
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
