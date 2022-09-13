import { Box, Button, Tooltip } from "@mui/material";
import React from "react";
import TabContext from "@mui/lab/TabContext";
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
import { SearchHttpService } from "../../api/v2/search";
const { NavbarComponent } = require("../../components/navBar/NavbarComponent");

export function ProfileScreen() {
	const searchHttpService = new SearchHttpService();
	const authHttpService = new AuthHttpService();
	const [assets, setAssets] = useState([]);
	const [loggedUser, setLoggedUserUser] = useState({});
	const [user, setUser] = useState({});
	const { username } = useParams();
	const [nftLoading, setNftLoading] = useState(false);

	async function getUserAssets() {
		setNftLoading(true);
		const localUser = await JSON.parse(localStorage.getItem("user"));
		setLoggedUserUser(localUser ? localUser : {});
		const resolved = await searchHttpService.searchAssets({
			owner: localUser.address,
		});
		setAssets(resolved.data);
		setNftLoading(false);
	}

	async function getUser() {
		const resolved = await authHttpService.getUserById(username);
		setUser(resolved.data);
		getUserAssets(resolved.data._id);
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
							<Tooltip title={user.username} arrow>
								<span>
									{user.username && (
										<p style={{ fontWeight: "medium" }}>
											@
											{user.username.length > 20
												? `${user.username.substring(
														0,
														4
												  )}...${user.username.slice(-4)}`
												: user.username}
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
									)}
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
			<Box
				p={2}
				borderRadius={"4px"}
				style={{ margin: "16px", backgroundColor: "white" }}
			>
				<Typography variant="h1">NFT's</Typography>
				<Box mb={2}></Box>
				<TabContext value={1}>
					<NFTList
						nftLoading={nftLoading}
						assets={assets}
						isAuthenticated={loggedUser._id === user._id}
						thirdParty={false}
					/>
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
							<Box
								onClick={() =>
									navigate(`/assets/${a.contract_address}/${a.item_id}`)
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
