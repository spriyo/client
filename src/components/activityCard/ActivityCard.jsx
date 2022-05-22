import {
	Avatar,
	Box,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { OfferHttpService } from "../../api/offer";
import { getWalletAddress } from "../../utils/wallet";
import "./activityCard.css";

const BoxShadow = styled(Box)(({ theme }) => ({
	boxShadow: theme.shadows[0],
	margin: "4px 0",
	border: "1px solid #ebebeb",
	borderRadius: "10px",
}));

function getKeyword(event) {
	switch (event.event_type) {
		case "mint":
			return "Minted";
		case "bid":
			return "Bidded";
		case "auction_create":
			return "Listed";
		case "auction_update_price":
			return "Updated Price";
		case "auction_canceld":
			return "Auction Canceled";
		case "offer_created":
			return "Offer Made";
		case "offer_accepted":
			return "Offer Accepted";
		case "offer_canceled":
			return "Offer Canceled";
		case "sale_created":
			return "Buy Now Price Set";
		case "sale_update_price":
			return "Buy Now Price Updated";
		case "sale_accepted":
			return "Bought";
		case "sale_canceled":
			return "Buy Now Removed";
		default:
			return "None";
	}
}

export function ActivityCardComponent({ event, asset }) {
	const offerHttpService = new OfferHttpService();
	const [loading, setLoading] = useState(false);
	const marketContract = useSelector(
		(state) => state.contractReducer.marketContract
	);
	const user = useSelector((state) => state.authReducer.user);
	const nftContract = useSelector((state) => state.contractReducer.nftContract);

	async function acceptOffer() {
		if (loading) return;
		setLoading(true);
		const isApproved = await checkApproval();
		if (!isApproved) return;
		const confirm = window.confirm(
			"Are you sure you want to accept the offer?"
		);
		if (!confirm) return;
		try {
			const currentAddress = await getWalletAddress();
			const transaction = await marketContract.methods
				.acceptOffer(asset.events[0].data.offer_id)
				.send({
					from: currentAddress,
				});
			console.log(transaction);

			// Server Event
			const resolved = await offerHttpService.acceptOffer(
				asset.events[0].data._id
			);
			console.log(resolved);
			if (!resolved.error) {
				window.location.reload();
			}
		} catch (e) {
			console.log(e);
		}
		setLoading(false);
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

	function isOfferExpired(expireAt) {
		return new Date(expireAt).getTime() / 1000 < Date.now() / 1000;
	}

	return (
		<BoxShadow>
			<Stack>
				<ListItem
					secondaryAction={
						<Typography variant="h5" color={"text.primary"}>
							{`${window.web3.utils.fromWei(event.data.amount)} MATIC`}
						</Typography>
					}
				>
					<ListItemAvatar>
						<Avatar src={event.user_id.displayImage}></Avatar>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Stack direction={"row"}>
								<Typography variant="h3" color={"text.primary"}>
									{`${getKeyword(event)} `}
								</Typography>
								<Typography variant="h5" color={"text.secondary"}>
									&nbsp;
									{`by@${
										event.user_id.username.length > 20
											? `${event.user_id.username.substring(
													0,
													4
											  )}...${event.user_id.username.slice(-4)}`
											: event.user_id.username
									}`}
								</Typography>
							</Stack>
						}
						// secondary={event.user_id.username}
						secondary={`${new Date(event.createdAt).toDateString()}, ${new Date(
							event.createdAt
						).toLocaleTimeString()}`}
					/>
				</ListItem>
				{event.event_type === "offer_created" &&
					user._id === asset.owner._id &&
					event.data.sold === false && (
						<Box
							backgroundColor={"primary.main"}
							p={1}
							borderRadius="0px 0px 10px 10px"
							onClick={() =>
								isOfferExpired(event.data.expireAt)
									? alert("Offer Expired Already!")
									: acceptOffer
							}
							sx={{ cursor: "pointer" }}
						>
							<Typography variant="h3" textAlign={"center"} color={"white"}>
								{loading ? (
									"loading..."
								) : isOfferExpired(event.data.expireAt) ? (
									"Offer Expired"
								) : (
									<Stack direction={"column"} alignItems="center">
										<Typography variant="h3">Accept Offer &nbsp;</Typography>
										<Timer expireAt={event.data.expireAt} />
									</Stack>
								)}
							</Typography>
						</Box>
					)}
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
