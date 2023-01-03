import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getWalletAddress } from "../utils/wallet";
import { ButtonComponent } from "./ButtonComponent";
import { ConnectComponent } from "./ConnectComponent";
import { checkApproval } from "../utils/checkApproval";
import { utils } from "web3";
import TransactionDialogue from "./TransactionDialogue";

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
	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);
	const nftContract = useSelector((state) => state.contractReducer.nftContract);

	useEffect(() => {
		if (asset && marketContract) {
			// Get Owner
			if (asset.type === "721" && nftContract) {
				nftContract.methods
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
	}, [asset, marketContract, nftContract]);

	const user = useSelector((state) => state.authReducer.user);

	function getActions(event) {
		let actions = [];
		if (!user) return actions;
		if (sale && !sale.sold) {
			// If sale exist's and if sale is not over
			actions =
				sale.seller !== utils.toChecksumAddress(user.address) ||
				event.from !== utils.toChecksumAddress(user.address)
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
		} else {
			actions =
				utils.toChecksumAddress(user.address) === owner
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
		}
		return actions;
		// switch (event.log.topics[0]) {
		// 	case ERC1155_BATCH_TRANSFER_EVENT_HASH:
		// 	case ERC1155_TRANSFER_EVENT_HASH:
		// 	case ERC721_TRANSFER_EVENT_HASH:
		// 		actions =
		// 			utils.toChecksumAddress(user.address) === event.to
		// 				? // || (event.event_type === "offer_canceled" &&
		// 				  // 	user._id === asset.owner._id)
		// 				  [
		// 						{
		// 							title: "Sell NFT",
		// 							action: () => approveMiddleware(sellAsset),
		// 						},
		// 						// {
		// 						// 	title: "Create Auction",
		// 						// 	action: () => approveMiddleware(createAuction),
		// 						// },
		// 				  ]
		// 				: [
		// 						// {
		// 						// 	title: "Make Offer",
		// 						// 	action: () => loadMiddleware(makeOffer),
		// 						// },
		// 				  ];
		// 		break;
		// 	case SALE_EVENT_HASH:
		// 		actions =
		// 			sale.seller !== utils.toChecksumAddress(user.address) ||
		// 			event.from !== utils.toChecksumAddress(user.address)
		// 				? [
		// 						{
		// 							title: `Buy for ${utils.fromWei(
		// 								sale ? sale.amount : "0"
		// 							)}SHM`,
		// 							action: () => loadMiddleware(buyAsset),
		// 						},
		// 				  ]
		// 				: [
		// 						{
		// 							title: "Update Price",
		// 							action: () => loadMiddleware(updateAsset),
		// 						},
		// 						{
		// 							title: "Cancel Sale",
		// 							action: () => loadMiddleware(cancelSale),
		// 						},
		// 				  ];
		// 		break;
		// 	case "Update": // sale_update_price
		// 		actions =
		// 			sale.seller === utils.toChecksumAddress(user.address)
		// 				? [
		// 						{
		// 							title: "Update Price",
		// 							action: () => loadMiddleware(updateAsset),
		// 						},
		// 						{
		// 							title: "Cancel Sale",
		// 							action: () => loadMiddleware(cancelSale),
		// 						},
		// 				  ]
		// 				: [
		// 						{
		// 							title: `Buy for ${utils.fromWei(
		// 								sale ? sale.amount : "0"
		// 							)}SHM`,
		// 							action: () => loadMiddleware(buyAsset),
		// 						},
		// 				  ];
		// 		break;
		// 	default:
		// 		actions = [
		// 			{
		// 				title: "Invalid Event",
		// 				action: function () {
		// 					alert("Invalid Event");
		// 				},
		// 			},
		// 		];
		// 		break;
		// }
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
		await marketContract.methods
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
			.on("receipt", function (receipt) {
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

		await marketContract.methods
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
			<TransactionDialogue
				transactionHash={transactionHash}
				transactionStatus={transactionCompleted}
			/>
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
