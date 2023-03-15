import {
	Dialog,
	Divider,
	FormControl,
	IconButton,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { NFTHttpService } from "../api/v2/nft";
import LOADING_IMG from "../assets/loading-image.gif";
import { getWalletAddress } from "../utils/wallet";
import TransactionDialogue from "./TransactionDialogue";
import ListingContract from "../contracts/Listing.json";

export const SellDialogue = ({ isOpen, nft }) => {
	const [closed, setClosed] = useState(false);
	const [selectedTime, setSelectedTime] = useState(1);
	const [price, setPrice] = useState("1");
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(false);
	const [transactionHash, setTransactionHash] = useState("");
	const [transactionCompleted, setTransactionCompleted] = useState(false);
	const [selectedCurrency, setSelectedCurrency] = useState(
		"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
	);
	const nftHttpService = new NFTHttpService();
	let listingContract;

	async function createListing() {
		try {
			listingContract = new window.web3.eth.Contract(
				ListingContract.abi,
				"0x571A0982E177bdD805A60b10767D3566feD5224F"
			);
			if (loading) return;
			if (!price || price === 0) return toast("Enter Price");
			const convertedAmount = window.web3.utils.toWei(price);
			const startingTime = Math.floor(new Date().getTime() / 1000);
			const endTime = startingTime + 86400 * selectedTime;
			const listingParameters = [
				nft.contract_address,
				nft.token_id,
				quantity,
				convertedAmount,
				selectedCurrency,
				startingTime,
				endTime,
			];
			const currentAddress = await getWalletAddress();
			window.web3.eth.handleRevert = true;
			const gas = await listingContract.methods
				.setBuyPrice(listingParameters)
				.estimateGas({
					from: currentAddress,
				});
			listingContract.methods
				.setBuyPrice(listingParameters)
				.send({ from: currentAddress, gas })
				.on("transactionHash", function (hash) {
					setTransactionHash(hash);
				})
				.on("receipt", async function (receipt) {
					await nftHttpService.createEvent(receipt.transactionHash);
					setTransactionCompleted(true);
				});
		} catch (error) {
			console.log(error);
			toast(error.message);
		}
	}

	function addDefaultSrc(ev) {
		ev.target.src = LOADING_IMG;
	}

	useEffect(() => {
		if (isOpen) {
			setClosed(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	return (
		<Dialog open={closed}>
			<TransactionDialogue
				transactionHash={transactionHash}
				transactionStatus={transactionCompleted}
			/>
			<Box p={2} px={4} textAlign={"center"}>
				<IconButton
					sx={{ position: "absolute", right: 2, top: 8 }}
					onClick={() => {
						if (loading) return;
						setClosed(false);
					}}
				>
					<IoClose />
				</IconButton>
				<Box>
					<h3>List for sale</h3>
				</Box>
				<Box
					display={"flex"}
					alignItems="center"
					flexDirection={"column"}
					justifyContent={"center"}
					m={2}
					width={"30vw"}
				>
					<Box
						display={"flex"}
						justifyContent={"space-between"}
						alignItems={"center"}
						width={"100%"}
					>
						<Box display={"flex"}>
							<img
								onError={addDefaultSrc}
								src={nft.image}
								alt={nft._id}
								width="auto"
								style={{
									maxWidth: "50px",
									overflowX: "hidden",
									marginRight: "8px",
								}}
							/>
							<Box
								display={"flex"}
								flexDirection={"column"}
								alignItems={"flex-start"}
							>
								<h3>
									{nft.name === ""
										? `#${nft.token_id.substring(0, 20)}`
										: nft.name}
								</h3>
								<h5 style={{ fontWeight: "600" }}>
									{nft.contract.name.substring(0, 10)}
								</h5>
							</Box>
						</Box>
						<Box
							display={"flex"}
							flexDirection={"column"}
							alignItems={"flex-end"}
						>
							<h5 style={{ fontWeight: "600" }}>Listing Price</h5>
							<Box>
								<h5>{price} SHM</h5>
							</Box>
						</Box>
					</Box>
					<Box mx={3} my={2} width="100%">
						<Divider></Divider>
					</Box>

					<Box
						width={"30vw"}
						display={"flex"}
						flexDirection={"column"}
						alignItems={"flex-start"}
					>
						<Box>
							<h4>Set Price</h4>
						</Box>
						<Box display={"flex"} alignItems="center">
							<TextField
								type={"number"}
								fullWidth
								placeholder="Set price"
								size="small"
								value={price}
								inputProps={{ min: 0 }}
								onChange={(e) => {
									setPrice(e.target.value);
								}}
							/>
							<FormControl sx={{ m: 1, minWidth: 100 }} size="small">
								<Select
									value={selectedCurrency}
									onChange={(event) => {
										setSelectedCurrency(event.target.value);
									}}
								>
									<MenuItem
										value={"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"}
									>
										ETH
									</MenuItem>
									<MenuItem
										value={"0xebEDE296FE8FFC38A40d09aCf6Ea5E75b77449f1"}
									>
										WETH
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<Box
							mt={2}
							width={"30vw"}
							display={"flex"}
							flexDirection={"column"}
							alignItems={"flex-start"}
						>
							<Box>
								<h4>Set quantity</h4>
							</Box>
							<Box display={"flex"} alignItems="center">
								<TextField
									type={"number"}
									fullWidth
									placeholder="Set price"
									size="small"
									value={quantity}
									inputProps={{ min: 1 }}
									onChange={(e) => {
										setQuantity(e.target.value);
									}}
								/>
							</Box>
						</Box>
						<Box mt={2}>
							<h4>Set Duration</h4>
						</Box>
						<Box display={"flex"} alignItems="center" width={"100%"}>
							<FormControl sx={{ minWidth: 100 }} size="small">
								<Select
									value={selectedTime}
									onChange={(event) => {
										setSelectedTime(event.target.value);
									}}
									sx={{ textAlign: "start" }}
								>
									<MenuItem value={1}>1 Day</MenuItem>
									<MenuItem value={3}>3 Days</MenuItem>
									<MenuItem value={7}>7 Days</MenuItem>
									<MenuItem value={30}>1 Month - 30 Days</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</Box>
					<Box mx={3} my={3} width="100%">
						<Divider></Divider>
					</Box>
					<Box width={"100%"}>
						<Box display={"flex"} justifyContent={"space-between"}>
							<h4 style={{ fontWeight: "600" }}>Listing Price</h4>
							<h4 style={{ fontWeight: "600" }}>{price} SHM</h4>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<h4 style={{ fontWeight: "600" }}>Service Fee</h4>
							<h4 style={{ fontWeight: "600" }}>10 %</h4>
						</Box>
						<Box display={"flex"} justifyContent={"space-between"}>
							<h4 style={{ fontWeight: "600" }}>Creator Fee</h4>
							<h4 style={{ fontWeight: "600" }}>5 %</h4>
						</Box>
						<Box display={"flex"} mt={0.5} justifyContent={"space-between"}>
							<h4>Final earnings</h4>
							<h4>{price - (price * 10) / 100 + (price * 0) / 100} SHM</h4>
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
							onClick={createListing}
						>
							List for sale
						</Box>
					</Box>
				</Box>
			</Box>
		</Dialog>
	);
};
