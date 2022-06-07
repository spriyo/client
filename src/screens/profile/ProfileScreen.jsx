import { Box } from "@mui/system";
import React from "react";
import { useEffect, useState } from "react";
import { AssetHttpService } from "../../api/asset";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import { FooterComponent } from "../../components/FooterComponent";
import "./ProfileScreen.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { SettingComponent } from "../../components/SettingComponent";
const { NavbarComponent } = require("../../components/navBar/NavbarComponent");

export function ProfileScreen(params) {
	const assetHttpService = new AssetHttpService();
	const [assets, setAssets] = useState([]);
	const [user, setUser] = useState({});

	async function getUserAssets() {
		const localUser = await JSON.parse(localStorage.getItem("user"));
		setUser(localUser);
		const resolved = await assetHttpService.getUserAssets(localUser._id);
		setAssets(resolved.data);
	}

	const [open, setOpen] = useState(false);

	const handleClose = (value) => {
		setOpen(false);
	};

	useEffect(() => {
		getUserAssets();
	}, []);

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
							<p style={{ fontWeight: "bold" }}>{user.displayName}</p>
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

			{/* Description */}
			<div className="profile-description">
				<h2>Description</h2>
				<p>
					BearX is a limited NFT collection of Genesis and Mini Bears created on
					Ethereum blockchain.
				</p>
			</div>
			<div style={{ margin: "32px" }}>
				<CollectionContainer title={"Your NFTs"} assets={assets} />
			</div>

			<div style={{ marginBottom: "64px" }}>.</div>
			<FooterComponent />
		</div>
	);
}
