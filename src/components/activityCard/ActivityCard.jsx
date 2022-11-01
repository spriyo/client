import {
	Box,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import web3 from "web3";
import { useState } from "react";
import { useSelector } from "react-redux";
import { OfferHttpService } from "../../api/offer";
import { getWalletAddress } from "../../utils/wallet";
import "./activityCard.css";
import { CircularProfile } from "../CircularProfileComponent";
import { useNavigate } from "react-router-dom";
import { checkApproval } from "../../utils/checkApproval";

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
		case "imported":
			return "Imported";
		case "bid":
			return "Bidded";
		case "auction_create":
			return "Listed";
		case "auction_update_price":
			return "Updated Price";
		case "auction_canceled":
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
		case "transfer":
			return "Transfered";
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
	const navigate = useNavigate();

	async function acceptOffer() {
		if (loading) return;
		setLoading(true);
		const isApproved = await checkApproval(
			marketContract._address,
			asset.contract_address,
			asset.token_id
		);
		if (!isApproved) {
			setLoading(false);
			return;
		}
		const confirm = window.confirm(
			"Are you sure you want to accept the offer?"
		);
		if (!confirm) {
			setLoading(false);
			return;
		}
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

	function isOfferExpired(expireAt) {
		return new Date(expireAt).getTime() / 1000 < Date.now() / 1000;
	}

	return (
		<BoxShadow>
			<Stack>
				<ListItem
					secondaryAction={
						event.data.amount && (
							<Typography variant="h5" color={"text.primary"}>
								{`${web3.utils.fromWei(event.data.amount)} SHM`}
							</Typography>
						)
					}
				>
					<ListItemAvatar>
						<Box onClick={() => navigate(`/${event.user_id.username}`)} m={1}>
							<CircularProfile
								userId={event.user_id._id}
								userImgUrl={event.user_id.displayImage}
							/>
						</Box>
					</ListItemAvatar>
					<ListItemText
						primary={
							<Stack>
								<Stack direction={"row"}>
									<Stack>
										<Stack direction={"row"}>
											<Typography variant="h3" color={"black"}>
												{`${getKeyword(event)} `}
											</Typography>
											{event.event_type.includes("bid") ||
											event.event_type.includes("auction") ? (
												<Stack direction={"row"}>
													<Typography variant="h5" color={"text.primary"}>
														&nbsp; for
													</Typography>
													<Typography
														onClick={() =>
															navigate(`/${event.user_id.username}`)
														}
														variant="h5"
														color={"black"}
														sx={{ cursor: "pointer" }}
													>
														&nbsp;
														{` ${web3.utils.fromWei(
															event.data.reserve_price
														)} SHM`}
													</Typography>
												</Stack>
											) : (
												<p></p>
											)}
										</Stack>
										<Typography
											onClick={() => navigate(`/${event.user_id.username}`)}
											variant="h6"
											color={"text.primary"}
											sx={{ cursor: "pointer" }}
										>
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

									<br />
								</Stack>
								<p style={{ fontSize: "10px", fontWeight: "500" }}>
									{`${new Date(event.createdAt).toDateString()}, ${new Date(
										event.createdAt
									).toLocaleTimeString()}`}
								</p>
							</Stack>
						}
						// secondary={event.user_id.username}
					/>
				</ListItem>
				{event.event_type === "offer_created" &&
					user &&
					user.address === asset.owner &&
					event.data.sold === false && (
						<Box
							backgroundColor={"primary.main"}
							p={1}
							borderRadius="0px 0px 10px 10px"
							onClick={() =>
								isOfferExpired(event.data.expireAt)
									? alert("Offer Expired Already!")
									: acceptOffer()
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
