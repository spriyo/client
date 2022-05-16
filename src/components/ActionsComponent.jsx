import { Box } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SaleHttpService } from "../api/sale";
import { getWalletAddress } from "../utils/wallet";
import { ButtonComponent } from "./ButtonComponent";

const loaderStyle = {
	backgroundImage:
		"linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
	p: 1,
	m: 1,
	color: "white",
	fontWeight: 500,
	textAlign: "center",
	borderRadius: "10px",
};

export const ActionsComponent = ({ asset }) => {
	const [loading, setLoading] = useState(false);
	const saleHttpService = new SaleHttpService();
	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);
	const nftContract = useSelector((state) => state.contractReducer.nftContract);
	const user = useSelector((state) => state.authReducer.user);

	function getActions(event) {
		let actions = [];
		if (!user) return actions;
		switch (event.event_type) {
			case "sale_accepted":
			case "mint":
				actions =
					event.user_id._id === user._id
						? [
								{
									title: "Sell",
									action: () => approveMiddleware(sellAsset),
								},
								{
									title: "Auction",
									action: () => alert("Auction feature coming soon!"),
								},
						  ]
						: [
								{
									title: "Make Offer",
									action: function () {
										alert("Offer Place");
									},
								},
						  ];
				break;
			case "bid":
			case "auction_create":
				actions =
					event.user_id._id === user._id
						? []
						: [
								{
									title: "Place Bid",
									action: function () {
										alert("Place Bid coming soon!");
									},
								},
						  ];
				break;
			case "sale_created":
				actions =
					event.user_id._id !== user._id
						? [
								{
									title: "Buy",
									action: () => buyAsset(),
								},
						  ]
						: [
								{
									title: "Update Price",
									action: function () {
										alert("Buy Price Updated");
									},
								},
								{
									title: "Cancel Sale",
									action: function () {
										alert("Sale Canceled");
									},
								},
						  ];
				break;
			default:
				actions = [
					{
						title: "Invalid Event",
						action: function () {
							alert("Invalid Event");
						},
					},
				];
				break;
		}
		return actions;
	}

	// async function makeOffer() {
	// 	const value = prompt("Please enter the amount in Matic");
	// 	if (typeof parseFloat(value) !== "number") return;

	// 	const currentAddress = await getWalletAddress();
	// 	const transaction = await marketContract.methods
	// 		.makeOffer(asset.contract_address, asset.item_id, "1000")
	// 		.send({ from: currentAddress });
	// 	console.log(transaction);

	// 	// Server Event
	// 	const resolved = await offerHttpService.createOffer({
	// 		asset_id: asset._id,
	// 		amount: "1000",
	// 	});
	// 	console.log(resolved);
	// }

	// async function createAuction() {
	// 	alert("Create Auction coming soon!");
	// }

	async function sellAsset() {
		const amount = prompt("Please enter the amount in Matic");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;
		const convertedAmount = window.web3.utils.toWei(amount);
		const tx = await marketContract.methods
			.setBuyPrice(asset.contract_address, asset.item_id, convertedAmount)
			.send({ from: currentAddress });
		console.log(tx.events.EventSale.returnValues.id);

		// Server Event
		const resolved = await saleHttpService.createSale({
			asset_id: asset._id,
			amount: convertedAmount,
			sale_id: parseInt(tx.events.EventSale.returnValues.id),
		});
		console.log(resolved);
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function buyAsset() {
		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		const tx = await marketContract.methods
			.buy(asset.contract_address, asset.item_id, asset.events[0].data.sale_id)
			.send({
				from: currentAddress,
				value: asset.events[0].data.amount,
			});
		console.log(tx);

		// Server Event
		const resolved = await saleHttpService.buySale(asset.events[0].data._id);
		if (!resolved.error) {
			// window.location.reload();
		}
		console.log(resolved);
	}

	async function checkApproval() {
		let isApproved = false;
		try {
			const currentAddress = await getWalletAddress();
			// Check for approval
			const approveAddress = await nftContract.methods
				.getApproved(asset.item_id)
				.call();
			if (marketContract._address !== approveAddress) {
				const isConfirmed = window.confirm(
					"Before selling the NFT on Spriyo, please approve us as a operator for your NFT."
				);
				if (isConfirmed) {
					const transaction = await nftContract.methods
						.approve(marketContract._address, asset.item_id)
						.send({ from: currentAddress });
					isApproved = true;
					console.log(transaction);
				}
			} else {
				isApproved = true;
			}
		} catch (error) {
			console.log(error.message);
		}
		return isApproved;
	}

	async function approveMiddleware(callback) {
		setLoading(true);
		const isApproved = await checkApproval();
		if (!isApproved) return setLoading(false);
		await callback();
		setLoading(false);
	}

	return loading ? (
		<Box sx={loaderStyle}>loading</Box>
	) : (
		<Box display={"flex"} sx={{ justifyContent: { xs: "center", md: "end" } }}>
			{getActions(asset.events[0]).map((e, i) => (
				<Box key={i} width="auto" p={2} display="flex">
					<ButtonComponent
						text={e.title}
						rounded={true}
						filled={true}
						onClick={e.action}
					/>
				</Box>
			))}
		</Box>
	);
};
