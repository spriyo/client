import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWalletAddress } from "../utils/wallet";
import { ButtonComponent } from "./ButtonComponent";
import { ConnectComponent } from "./ConnectComponent";
import { checkApproval } from "../utils/checkApproval";
import { utils } from "web3";
import TransactionDialogue from "./TransactionDialogue";
import nftJsonInterface from "../contracts/Spriyo.json";
import { NULL_ADDRESS } from "../constants";
import { toast } from "react-toastify";

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
	const [transactionHash, setTransactionHash] = useState("");
	const [transactionCompleted, setTransactionCompleted] = useState(false);
	const [owner, setOwner] = useState(false);
	const [loading, setLoading] = useState(false);
	const [sale, setSale] = useState(false);
	const [auction, setAuction] = useState(false);
	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);
	const auctionContract = useSelector(
		(state) => state.contractReducer.auctionContract
	);

	useEffect(() => {
		if (asset && auctionContract) {
			// Get Sale
			auctionContract.methods
				.auction_by_address_id(asset.contract_address, asset.token_id)
				.call()
				.then((auctionData) => {
					if (!auctionData.sold && auctionData.seller !== NULL_ADDRESS) {
						setAuction(auctionData);
					}
				});
		}
		if (asset && marketContract) {
			// Get Owner
			if (asset.type === "721") {
				const contract = new window.web3.eth.Contract(
					nftJsonInterface.abi,
					asset.contract_address
				);
				contract.methods
					.ownerOf(asset.token_id)
					.call()
					.then((owner) => {
						setOwner(owner);
					});
			}
			// Get Sale
			marketContract.methods
				.sales_by_address_id(asset.contract_address, asset.token_id)
				.call()
				.then((saleData) => {
					setSale(saleData);
				});
		}
	}, [asset, marketContract, auctionContract]);

	const user = useSelector((state) => state.authReducer.user);

	function isAuctionExpired(expireAt) {
		return new Date(expireAt).getTime() / 1000 < Date.now() / 1000;
	}

	function getActions() {
		const userAddress = utils.toChecksumAddress(user.address);
		let actions = [];
		if (!user) return actions;
		if (sale && !sale.sold && sale.id !== "0") {
			// If sale exist's and if sale is not over
			actions =
				sale.seller !== utils.toChecksumAddress(user.address)
					? [
							{
								title: `Buy for ${utils.fromWei(sale ? sale.amount : "0")}SHM`,
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
		} else if (auction) {
			if (
				isAuctionExpired(auction.expireAt) &&
				(userAddress === auction.seller ||
					userAddress === auction.currentBidder)
			) {
				actions = [
					{
						title: "Settle Auction",
						action: () => loadMiddleware(settleAuction),
					},
				];
			} else
				actions =
					userAddress === auction.seller
						? [
								{
									title: "Cancel Auction",
									action: () => loadMiddleware(cancelAuction),
								},
								{
									title: "Update Price",
									action: () => loadMiddleware(updateReservePrice),
								},
						  ]
						: [
								{
									title: "Place Bid",
									action: () => loadMiddleware(bidAuction),
								},
						  ];
		} else {
			actions =
				userAddress === owner
					? [
							{
								title: "Sell NFT",
								action: () => approveMiddleware(sellAsset),
							},
							{
								title: "Create Auction",
								action: () => approveMiddleware(true, createAuction),
							},
					  ]
					: [
							{
								title: "Make Offer",
								action: () => loadMiddleware(makeOffer),
							},
					  ];
		}
		return actions;
	}

	async function createAuction() {
		const amount = prompt("Please enter the reserve amount.");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await auctionContract.methods
			.createReserveAuction(
				asset.contract_address,
				asset.token_id,
				convertedAmount
			)
			.estimateGas({
				from: currentAddress,
			});

		auctionContract.methods
			.createReserveAuction(
				asset.contract_address,
				asset.token_id,
				convertedAmount
			)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
	}

	async function updateReservePrice() {
		if (auction.currentBidder !== NULL_ADDRESS) {
			return toast("Auction has started already, cant update now.", {
				type: "error",
			});
		}
		const amount = prompt("Please enter new reserve amount.");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await auctionContract.methods
			.updateReservePrice(auction.id, convertedAmount)
			.estimateGas({
				from: currentAddress,
			});
		auctionContract.methods
			.updateReservePrice(auction.id, convertedAmount)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
	}

	async function cancelAuction() {
		if (auction.currentBidder !== NULL_ADDRESS) {
			return toast(
				"Auction has started already, you can't cancel the auction now.",
				{
					type: "error",
				}
			);
		}
		const confirmed = window.confirm(
			"Are you sure you want to cancel this auction?"
		);
		if (!confirmed) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await auctionContract.methods
			.cancelReserveAuction(auction.id)
			.estimateGas({
				from: currentAddress,
			});

		auctionContract.methods
			.cancelReserveAuction(auction.id)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
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
		const gas = await auctionContract.methods
			.settleAuction(auction.id)
			.estimateGas({
				from: currentAddress,
			});

		auctionContract.methods
			.settleAuction(auction.id)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
	}

	async function bidAuction() {
		const amount = prompt("Please enter bid amount.");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		const convertedAmount = window.web3.utils.toWei(amount);
		window.web3.eth.handleRevert = true;
		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		console.log(auction);
		const gas = await auctionContract.methods
			.placeBid(auction.id, convertedAmount)
			.estimateGas({
				from: currentAddress,
				value: convertedAmount,
			});

		auctionContract.methods
			.placeBid(auction.id, convertedAmount)
			.send({
				from: currentAddress,
				value: convertedAmount,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
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

		marketContract.methods
			.makeOffer(asset.contract_address, asset.token_id, convertedAmount)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
				value: convertedAmount,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
	}

	async function sellAsset() {
		const amount = prompt("Please enter the amount in SHM");
		if (isNaN(parseFloat(amount))) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;
		const convertedAmount = window.web3.utils.toWei(amount);
		marketContract.methods
			.setBuyPrice(asset.contract_address, asset.token_id, convertedAmount)
			.send({ from: currentAddress })
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
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

		marketContract.methods
			.buy(asset.contract_address, asset.token_id, sale.id)
			.send({
				from: currentAddress,
				value: sale.amount,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
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

		marketContract.methods
			.updateBuyPrice(sale.id, convertedAmount)
			.send({
				from: currentAddress,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
	}

	async function cancelSale() {
		const confirmed = window.confirm(
			"Are you sure you want to cancel this sale?"
		);
		if (!confirmed) return;

		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;
		console.log(asset);

		marketContract.methods
			.cancelBuyPrice(sale.id)
			.send({
				from: currentAddress,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", function (_) {
				setTransactionCompleted(true);
			});
	}

	async function approveMiddleware(isAuction, callback) {
		try {
			if (asset.type === "1155")
				return alert(
					"Feature yet to come on ERC-1155 token, try on ERC721 token."
				);
			setLoading(true);
			const isApproved = await checkApproval(
				isAuction ? auctionContract._address : marketContract._address,
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
		<Box p={2} display="flex" justifyContent="center">
			<ConnectComponent />
		</Box>
	) : (
		<Box display={"flex"} sx={{ justifyContent: { xs: "center", md: "end" } }}>
			<TransactionDialogue
				transactionHash={transactionHash}
				transactionStatus={transactionCompleted}
			/>
			{getActions(asset.events[0]).map((e, i) => (
				<Box key={i} width="auto" p={1} display="flex">
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
