import "./activityCard.css";
import {
	Box,
	Button,
	ListItem,
	ListItemText,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import Web3 from "web3";
import { useState } from "react";
import "./activityCard.css";
import { useNavigate } from "react-router-dom";
import { NULL_ADDRESS } from "../../constants";
import { getShortAddress } from "../../utils/addressShort";
import { getWalletAddress } from "../../utils/wallet";
import { useSelector } from "react-redux";
import { checkApproval } from "../../utils/checkApproval";
import TransactionDialogue from "../TransactionDialogue";

const BoxShadow = styled(Box)(({ theme }) => ({
	boxShadow: theme.shadows[0],
	margin: "4px 0",
	border: "1px solid #ebebeb",
	borderRadius: "10px",
}));

export function OfferCardComponent({ asset, offer }) {
	const [transactionHash, setTransactionHash] = useState("");
	const [transactionCompleted, setTransactionCompleted] = useState(false);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const web3 = new Web3();
	const offerTypes = ["Created Offer", "Accepted Offer", "Canceled Offer"];
	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);

	function getKeyword() {
		let k;
		if (offer.offer_status === "created") {
			k = offerTypes[0];
		} else if (offer.offer_status === "accepted") {
			k = offerTypes[1];
		} else {
			k = offerTypes[2];
		}
		return `${k} for ${web3.utils.fromWei(offer.amount)} SHM`;
	}

	async function approveMiddleware(callback) {
		try {
			const isApproved = await checkApproval(marketContract._address, asset);
			if (!isApproved) return;
			await callback();
		} catch (error) {
			console.log(error.message);
		}
	}

	async function cancelOffer() {
		const confirm = window.confirm(
			"Are you sure you want to cancel the offer?"
		);
		if (!confirm) return;

		const currentAddress = await getWalletAddress();
		marketContract.methods
			.cancelOffer(offer.offer_id)
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

	async function acceptOffer() {
		const confirm = window.confirm(
			"Are you sure you want to accept the offer?"
		);
		if (!confirm) return;

		const currentAddress = await getWalletAddress();
		marketContract.methods
			.acceptOffer(offer.offer_id)
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

	return (
		<BoxShadow>
			<TransactionDialogue
				transactionHash={transactionHash}
				transactionStatus={transactionCompleted}
			/>
			<Stack>
				<ListItem
					secondaryAction={
						<Stack direction={"row"} alignItems={"center"}>
							{offer.offer_status === "created" &&
							user &&
							asset.owners[0].address ===
								web3.utils.toChecksumAddress(user.address) ? (
								<Button onClick={() => approveMiddleware(acceptOffer)}>
									Accept Offer
								</Button>
							) : user &&
							  offer.offer_from ===
									web3.utils.toChecksumAddress(user.address) &&
							  offer.offer_status === "created" ? (
								<Button onClick={cancelOffer}>Cancel Offer</Button>
							) : (
								""
							)}
						</Stack>
					}
				>
					<ListItemText
						primary={
							<Stack>
								<Stack direction={"row"}>
									<Stack>
										<Stack direction={"row"}>
											<Typography variant="h3" color={"black"}>
												{getKeyword()}
												{offer.offer_from === NULL_ADDRESS ? (
													""
												) : (
													<small></small>
												)}
											</Typography>
										</Stack>
										<Stack direction={"row"}>
											<Typography
												onClick={() => navigate(`/${offer.offer_from}`)}
												variant="h6"
												color={"text.primary"}
												sx={{ cursor: "pointer" }}
											>
												{`From @${getShortAddress(offer.offer_from)}`}
											</Typography>
										</Stack>
									</Stack>

									<br />
								</Stack>
								<p style={{ fontSize: "10px", fontWeight: "500" }}>
									{`${new Date(offer.createdAt).toDateString()}, ${new Date(
										offer.createdAt
									).toLocaleTimeString()}`}
								</p>
							</Stack>
						}
					/>
				</ListItem>
			</Stack>
		</BoxShadow>
	);
}

export const Timer = ({ expireAt }) => {
	const [expiringIn, setExpiringIn] = useState(null);
	var x = setInterval(function () {
		// Get today's date and time
		var now = new Date().getTime();

		// Find the distance between now and the count down date
		var distance = new Date(expireAt).getTime() - now;

		// Time calculations for days, hours, minutes and seconds
		var hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		// Output the result in an element with id="demo"
		setExpiringIn(hours + "h " + minutes + "m " + seconds + "s ");

		// If the count down is over, write some text
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("demo").innerHTML = "EXPIRED";
		}
	}, 1000);

	return <Typography variant="h6">{`(Expires in ${expiringIn})`}</Typography>;
};
