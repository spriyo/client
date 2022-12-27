import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SaleHttpService } from "../api/sale";
import { OfferHttpService } from "../api/offer";
import { getWalletAddress } from "../utils/wallet";
import { ButtonComponent } from "./ButtonComponent";
import { ConnectComponent } from "./ConnectComponent";
import { AuctionHttpService } from "../api/auction";
import { checkApproval } from "../utils/checkApproval";
import { utils } from "web3";

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

export const ActionsComponent2 = ({ asset }) => {
	const [loading, setLoading] = useState(false);
	const [sale, setSale] = useState(false);
	const saleHttpService = new SaleHttpService();
	const offerHttpService = new OfferHttpService();
	const auctionHttpService = new AuctionHttpService();
	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);

	useEffect(() => {
		if (asset && marketContract) {
			marketContract.methods
				.sales_by_address_id(asset.contract_address, asset.token_id)
				.call()
				.then((saleData) => {
					setSale(saleData);
				});
		}
	}, [asset, marketContract]);

	const user = useSelector((state) => state.authReducer.user);

	function isAuctionExpired(expireAt) {
		return new Date(expireAt).getTime() / 1000 < Date.now() / 1000;
	}

	function getActions(event) {
		let actions = [];
		if (!user) return actions;
		switch (event.method) {
			case "0xa59ac6dd": // sale_accepted
			case "0xb62deb65": // sale_canceled
			case "offer_canceled":
			case "offer_accepted":
			case "imported":
			case "transfer":
			case "auction_canceled":
			case "Sale":
			case "0xd85d3d27": // mint
				actions =
					utils.toChecksumAddress(user.address) === event.to
						? // || (event.event_type === "offer_canceled" &&
						  // 	user._id === asset.owner._id)
						  [
								{
									title: "Sell NFT",
									action: () => approveMiddleware(sellAsset),
								},
								// {
								// 	title: "Create Auction",
								// 	action: () => approveMiddleware(createAuction),
								// },
						  ]
						: [
								// {
								// 	title: "Make Offer",
								// 	action: () => loadMiddleware(makeOffer),
								// },
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
									action: () => approveMiddleware(createAuction),
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
			case "auction_update_price":
			case "auction_create":
				actions =
					event.user_id._id === user._id && user._id === asset.owner._id
						? isAuctionExpired(event.data.expireAt)
							? [
									{
										title: "Settle Auction",
										action: () => loadMiddleware(settleAuction),
									},
							  ]
							: [
									{
										title: "Cancel Auction",
										action: () => loadMiddleware(cancelAuction),
									},
									{
										title: "Update Price",
										action: () => loadMiddleware(updateReservePrice),
									},
							  ]
						: isAuctionExpired(event.data.expireAt) &&
						  user._id === event.user_id._id
						? [
								{
									title: "Settle Auction",
									action: () => loadMiddleware(settleAuction),
								},
						  ]
						: [
								{
									title: "Place Bid",
									action: () => loadMiddleware(bidAuction),
								},
						  ];
				break;
			case "0x798bac8d": // sale_created
			case "List":
				actions =
					sale.seller !== utils.toChecksumAddress(user.address) ||
					event.from !== utils.toChecksumAddress(user.address)
						? [
								{
									title: `Buy for ${utils.fromWei(
										sale ? sale.amount : "0"
									)}SHM`,
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
			case "Update": // sale_update_price
				actions =
					sale.seller === utils.toChecksumAddress(user.address)
						? [
								{
									title: "Update Price",
									action: () => loadMiddleware(updateAsset),
								},
								{
									title: "Cancel Sale",
									action: () => loadMiddleware(cancelSale),
								},
						  ]
						: [
								{
									title: `Buy for ${utils.fromWei(
										sale ? sale.amount : "0"
									)}SHM`,
									action: () => loadMiddleware(buyAsset),
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
		const amount = prompt("Please enter the amount in SHM");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.makeOffer(asset.contract_address, asset.token_id, convertedAmount)
			.estimateGas({
				from: currentAddress,
				value: convertedAmount,
			});

		const transaction = await marketContract.methods
			.makeOffer(asset.contract_address, asset.token_id, convertedAmount)
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
		const amount = prompt("Please enter the amount in SHM");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;
		const convertedAmount = window.web3.utils.toWei(amount);
		const tx = await marketContract.methods
			.setBuyPrice(asset.contract_address, asset.token_id, convertedAmount)
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
		if (!sale && sale.sold) return;
		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.buy(asset.contract_address, asset.token_id, sale.id)
			.estimateGas({
				from: currentAddress,
				value: sale.amount,
			});

		await marketContract.methods
			.buy(asset.contract_address, asset.token_id, sale.id)
			.send({
				from: currentAddress,
				value: sale.amount,
				gasPrice,
				gas,
			});

		// Server Event
		const resolved = await saleHttpService.buySale(asset._id);
		if (!resolved.error) {
			window.location.reload();
		}
		console.log(resolved);
	}

	async function updateAsset() {
		const amount = prompt(
			"Please enter the amount in SHM to update the sale price."
		);
		if (isNaN(parseFloat(amount))) return;

		const convertedAmount = window.web3.utils.toWei(amount);
		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.updateBuyPrice(sale.id, convertedAmount)
			.estimateGas({
				from: currentAddress,
			});

		const tx = await marketContract.methods
			.updateBuyPrice(sale.id, convertedAmount)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			});
		console.log(tx);

		// Server Event
		const resolved = await saleHttpService.updateSale(asset._id, {
			amount: convertedAmount,
		});
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

		const tx = await marketContract.methods.cancelBuyPrice(sale.id).send({
			from: currentAddress,
		});
		console.log(tx);

		// Server Event
		const resolved = await saleHttpService.cancelSale(asset._id);
		if (!resolved.error) {
			window.location.reload();
		}
		console.log(resolved);
	}

	async function createAuction() {
		const amount = prompt("Please enter the reserve amount.");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.createReserveAuction(
				asset.contract_address,
				asset.token_id,
				convertedAmount
			)
			.estimateGas({
				from: currentAddress,
			});

		const tx = await marketContract.methods
			.createReserveAuction(
				asset.contract_address,
				asset.token_id,
				convertedAmount
			)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			});

		// Server Event
		const resolved = await auctionHttpService.createAuction({
			asset_id: asset._id,
			reserve_price: convertedAmount,
			auction_id: parseInt(tx.events.EventAuction.returnValues.id),
		});

		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function updateReservePrice() {
		const amount = prompt("Please enter new reserve amount.");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.updateReservePrice(asset.events[0].data.auction_id, convertedAmount)
			.estimateGas({
				from: currentAddress,
			});
		await marketContract.methods
			.updateReservePrice(asset.events[0].data.auction_id, convertedAmount)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			});

		// Server Event
		const resolved = await auctionHttpService.updateReservePrice(
			asset.events[0].data._id,
			{
				reserve_price: convertedAmount,
			}
		);
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function cancelAuction() {
		const confirmed = window.confirm(
			"Are you sure you want to cancel this auction?"
		);
		if (!confirmed) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.cancelReserveAuction(asset.events[0].data.auction_id)
			.estimateGas({
				from: currentAddress,
			});

		await marketContract.methods
			.cancelReserveAuction(asset.events[0].data.auction_id)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			});

		// Server Event
		const resolved = await auctionHttpService.cancelAuction(
			asset.events[0].data._id
		);
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function settleAuction() {
		const confirmed = window.confirm(
			"Are you sure you want to settle this auction?"
		);
		if (!confirmed) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.settleAuction(asset.events[0].data.auction_id)
			.estimateGas({
				from: currentAddress,
			});

		await marketContract.methods
			.settleAuction(asset.events[0].data.auction_id)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			});

		// Server Event
		const resolved = await auctionHttpService.settleAuction(
			asset.events[0].data._id
		);
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function bidAuction() {
		const amount = prompt("Please enter bid amount.");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await marketContract.methods
			.placeBid(asset.events[0].data.auction_id)
			.estimateGas({
				from: currentAddress,
				value: convertedAmount,
			});

		await marketContract.methods
			.placeBid(asset.events[0].data.auction_id)
			.send({
				from: currentAddress,
				value: convertedAmount,
				gasPrice,
				gas,
			});

		// Server Event
		const resolved = await auctionHttpService.bidAuction({
			auction_id: asset.events[0].data._id,
			amount: convertedAmount,
		});
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function approveMiddleware(callback) {
		try {
			if (asset.type === "1155")
				return alert(
					"Feature yet to come on ERC-1155 token, try on ERC721 token."
				);
			setLoading(true);
			const isApproved = await checkApproval(
				marketContract._address,
				asset.contract_address,
				asset.token_id
			);
			if (!isApproved) return setLoading(false);
			await callback();
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	async function loadMiddleware(callback) {
		try {
			if (asset.type === "1155")
				return alert(
					"Feature yet to come on ERC-1155 token, try on ERC721 token."
				);
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
		<Box p={2} display='flex' justifyContent='center'>
			<ConnectComponent />
		</Box>
	) : (
		<Box display={"flex"} sx={{ justifyContent: { xs: "center", md: "end" } }}>
			{getActions(asset.events[0]).map((e, i) => (
				<Box key={i} width='auto' p={1} display='flex'>
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
