import React from "react";
import { useEffect, useState } from "react";
import { AssetHttpService } from "../../api/asset";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import "./ProfileScreen.css";
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

	useEffect(() => {
		getUserAssets();
	}, []);

	return (
		<div className="profile-container">
			<NavbarComponent></NavbarComponent>
			<div className="profile-header">
				<div className="banner-image"></div>
				<div className="profile-details">
					<div
						className="profile-details-image"
						style={{ backgroundImage: `url(${user.displayImage})` }}
					></div>
					<div>
						<p style={{ fontWeight: "bold" }}>{user.displayName}</p>
						<p style={{ fontWeight: "medium" }}>@{user.displayName}</p>
					</div>
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
				</div>
			</div>

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
		</div>
	);
}
