import { Box } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { SaleHttpService } from "../api/sale";
import { OfferHttpService } from "../api/offer";
import { getWalletAddress } from "../utils/wallet";
import { ButtonComponent } from "./ButtonComponent";
import { ConnectComponent } from "./ConnectComponent";

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
	const offerHttpService = new OfferHttpService();

	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);
	const user = useSelector((state) => state.authReducer.user);
	const nftContract = useSelector((state) => state.contractReducer.nftContract);

	function getActions(event) {
		let actions = [];
		if (!user) return actions;
		switch (event.event_type) {
			case "sale_accepted":
			case "sale_canceled":
			case "offer_canceled":
			case "offer_accepted":
			case "mint":
				actions =
					user._id === asset.owner._id ||
					(event.event_type === "offer_canceled" &&
						user._id === asset.owner._id)
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
									action: () => loadMiddleware(makeOffer),
								},
						  ];
				break;
			case "offer_created":
				actions =
					user._id === asset.owner._id
						? [
								{
									title: "Sell",
									action: () => approveMiddleware(sellAsset),
								},
								{
									title: "Auction",
									action: () => alert("Auction feature coming soon!"),
								},
								// {
								// 	title: "Accept Offer",
								// 	action: () => approveMiddleware(acceptOffer),
								// },
						  ]
						: event.user_id._id === user._id
						? [
								{
									title: "Cancel Offer",
									action: () => loadMiddleware(cancelOffer),
								},
						  ]
						: [
								{
									title: "Make Offer",
									action: () => loadMiddleware(makeOffer),
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
			case "sale_update_price":
				actions =
					event.user_id._id !== user._id
						? [
								{
									title: "Buy",
									action: () => loadMiddleware(buyAsset),
								},
						  ]
						: [
								{
									title: "Update Price",
									action: () => loadMiddleware(updateAsset),
								},
								{
									title: "Cancel Sale",
									action: () => loadMiddleware(cancelSale),
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

	async function makeOffer() {
		const amount = prompt("Please enter the amount in Matic");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.makeOffer(asset.contract_address, asset.item_id, convertedAmount)
			.estimateGas({
				from: currentAddress,
				value: convertedAmount,
			});

		const transaction = await marketContract.methods
			.makeOffer(asset.contract_address, asset.item_id, convertedAmount)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
				value: convertedAmount,
			});
		console.log(transaction);

		// Server Event
		const resolved = await offerHttpService.createOffer({
			asset_id: asset._id,
			amount: convertedAmount,
			offer_id: parseInt(transaction.events.EventOffer.returnValues.id),
		});
		console.log(resolved);
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function cancelOffer() {
		const confirm = window.confirm(
			"Are you sure you want to cancel the offer?"
		);
		if (!confirm) return;

		const currentAddress = await getWalletAddress();
		const transaction = await marketContract.methods
			.cancelOffer(asset.events[0].data.offer_id)
			.send({
				from: currentAddress,
			});
		console.log(transaction);

		// Server Event
		const resolved = await offerHttpService.cancelOffer(
			asset.events[0].data._id
		);
		console.log(resolved);
		if (!resolved.error) {
			window.location.reload();
		}
	}

	// async function acceptOffer() {
	// 	const confirm = window.confirm(
	// 		"Are you sure you want to accept the offer?"
	// 	);
	// 	if (!confirm) return;

	// 	const currentAddress = await getWalletAddress();
	// 	const transaction = await marketContract.methods
	// 		.acceptOffer(asset.events[0].data.offer_id)
	// 		.send({
	// 			from: currentAddress,
	// 		});
	// 	console.log(transaction);

	// 	// Server Event
	// 	const resolved = await offerHttpService.acceptOffer(
	// 		asset.events[0].data._id
	// 	);
	// 	console.log(resolved);
	// 	if (!resolved.error) {
	// 		window.location.reload();
	// 	}
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

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.buy(asset.contract_address, asset.item_id, asset.events[0].data.sale_id)
			.estimateGas({
				from: currentAddress,
				value: asset.events[0].data.amount,
			});

		const tx = await marketContract.methods
			.buy(asset.contract_address, asset.item_id, asset.events[0].data.sale_id)
			.send({
				from: currentAddress,
				value: asset.events[0].data.amount,
				gasPrice,
				gas,
			});
		console.log(tx);

		// Server Event
		const resolved = await saleHttpService.buySale(asset.events[0].data._id);
		if (!resolved.error) {
			window.location.reload();
		}
		console.log(resolved);
	}

	async function updateAsset() {
		const amount = prompt(
			"Please enter the amount in Matic to update the sale price."
		);
		if (isNaN(parseFloat(amount))) return;

		const convertedAmount = window.web3.utils.toWei(amount);
		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;
		console.log(asset);

		const tx = await marketContract.methods
			.updateBuyPrice(asset.events[0].data.sale_id, convertedAmount)
			.send({
				from: currentAddress,
			});
		console.log(tx);

		// Server Event
		const resolved = await saleHttpService.updateSale(
			asset.events[0].data._id,
			{ amount: convertedAmount }
		);
		if (!resolved.error) {
			window.location.reload();
		}
		console.log(resolved);
	}

	async function cancelSale() {
		const confirmed = window.confirm(
			"Are you sure you want to cancel this sale?"
		);
		if (!confirmed) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;
		console.log(asset);

		const tx = await marketContract.methods
			.cancelBuyPrice(asset.events[0].data.sale_id)
			.send({
				from: currentAddress,
			});
		console.log(tx);

		// Server Event
		const resolved = await saleHttpService.cancelSale(asset.events[0].data._id);
		if (!resolved.error) {
			window.location.reload();
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
		try {
			setLoading(true);
			const isApproved = await checkApproval();
			if (!isApproved) return setLoading(false);
			await callback();
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	async function loadMiddleware(callback) {
		try {
			setLoading(true);
			await callback();
			setLoading(false);
		} catch (e) {
			setLoading(false);
		}
	}

	return loading ? (
		<Box sx={loaderStyle}>loading</Box>
	) : !user ? (
		<Box p={2} display="flex" justifyContent="center">
			<ConnectComponent />
		</Box>
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
