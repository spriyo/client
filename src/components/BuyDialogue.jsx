import { Dialog, Divider, IconButton, TextField, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { NFTHttpService } from "../api/v2/nft";
import { getWalletAddress } from "../utils/wallet";
import TransactionDialogue from "./TransactionDialogue";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { getShortAddress } from "../utils/addressShort";
import { CHAIN, NATIVE_CURRENCY } from "../constants";
import { validateERC20AndAllowance } from "../utils/validateERC20AndAllowance";

export const BuyDialogue = ({ isOpen, listing, onClose }) => {
	let loading = false;
	const [open, setOpen] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [transactionHash, setTransactionHash] = useState("");
	const [transactionCompleted, setTransactionCompleted] = useState(false);
	const nftHttpService = new NFTHttpService();
	const listingContract = useSelector(
		(state) => state.contractReducer.listingContract
	);

	async function buy() {
		try {
			if (loading) return;
			loading = true;
			if (!quantity || quantity === 0)
				return toast("Enter Quantity", { type: "warning" });
			const price = Web3.utils.fromWei(listing.pricePerToken) * quantity;
			const convertedAmount = Web3.utils.toWei(price.toString());
			if (listing.currency !== NATIVE_CURRENCY) {
				await validateERC20AndAllowance(
					listing.currency,
					convertedAmount,
					CHAIN.listingContract
				);
			}
			const currentAddress = await getWalletAddress();

			const gas = await listingContract.methods
				.buy(listing.listing_id, quantity, listing.currency, currentAddress)
				.estimateGas({
					from: currentAddress,
					value: convertedAmount,
				});

			listingContract.methods
				.buy(listing.listing_id, quantity, listing.currency, currentAddress)
				.send({ from: currentAddress, value: convertedAmount, gas })
				.on("transactionHash", function (hash) {
					setTransactionHash(hash);
				})
				.on("receipt", async function (receipt) {
					await nftHttpService.createEvent(receipt.transactionHash);
					setTransactionCompleted(true);
					loading = false;
				});
		} catch (error) {
			loading = false;
			toast(error.message, { type: "error" });
		}
	}

	useEffect(() => {
		setOpen(isOpen);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	return (
		<Dialog open={open}>
			<TransactionDialogue
				transactionHash={transactionHash}
				transactionStatus={transactionCompleted}
			/>
			<Box p={2} px={4} textAlign={"center"}>
				<IconButton
					sx={{ position: "absolute", right: 2, top: 8 }}
					onClick={() => {
						if (loading) return;
						setOpen(false);
						onClose();
					}}
				>
					<IoClose />
				</IconButton>
				<Box>
					<h3>Buy</h3>
				</Box>
				<Box
					display={"flex"}
					alignItems="center"
					flexDirection={"column"}
					justifyContent={"center"}
					my={2}
					width={"30vw"}
				>
					<Box mx={3} mb={2} width="100%">
						<Divider></Divider>
					</Box>
					<Box
						width={"30vw"}
						display={"flex"}
						flexDirection={"column"}
						alignItems={"flex-start"}
					>
						<Box
							width={"30vw"}
							display={"flex"}
							flexDirection={"column"}
							alignItems={"flex-start"}
						>
							<Box>
								<h4>Set quantity</h4>
							</Box>
							<Box display={"flex"} alignItems="center" width={"100%"}>
								<TextField
									type={"number"}
									fullWidth
									placeholder="Set price"
									size="small"
									value={quantity}
									inputProps={{ min: 1, max: listing.quantity }}
									onChange={(e) => {
										setQuantity(e.target.value);
									}}
								/>
							</Box>
							<p style={{ color: "grey", fontSize: "12px", fontWeight: "500" }}>
								Available {listing.quantity}
							</p>
						</Box>
					</Box>
				</Box>
				<Box width={"100%"}>
					<Box display={"flex"} justifyContent={"space-between"}>
						<h5 style={{ fontWeight: "600" }}>Currency</h5>
						<h5 style={{ fontWeight: "600" }}>
							{getShortAddress(listing.currency)}
						</h5>
					</Box>
					<Box display={"flex"} justifyContent={"space-between"}>
						<h5 style={{ fontWeight: "600" }}>Listing Price</h5>
						<h5 style={{ fontWeight: "600" }}>
							{Web3.utils.fromWei(listing.pricePerToken)} SHM
						</h5>
					</Box>
					<Box display={"flex"} justifyContent={"space-between"}>
						<h5 style={{ fontWeight: "600" }}>Total amount</h5>
						<h5 style={{ fontWeight: "600" }}>
							{Web3.utils.fromWei(listing.pricePerToken)} x {quantity} ={" "}
							{Web3.utils.fromWei(listing.pricePerToken) * quantity} SHM
						</h5>
					</Box>
					<Box display={"flex"} mt={0.5} justifyContent={"space-between"}>
						<h4>Final amount</h4>
						<h4>{Web3.utils.fromWei(listing.pricePerToken) * quantity} SHM</h4>
					</Box>
				</Box>
				<Box mt={3}>
					<Box
						px={7}
						py={2}
						color="black"
						fontWeight={"600"}
						borderRadius={"8px"}
						backgroundColor="#00e472"
						sx={{
							cursor: "pointer",
						}}
						onClick={buy}
					>
						Buy
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};
