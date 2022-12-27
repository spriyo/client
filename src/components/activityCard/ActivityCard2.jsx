import {
	Box,
	IconButton,
	ListItem,
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
import { useNavigate } from "react-router-dom";
import { checkApproval } from "../../utils/checkApproval";
import { FiExternalLink } from "react-icons/fi";
import { ChainsConfig, NULL_ADDRESS } from "../../constants";

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

export function ActivityCardComponent2({ event, asset }) {
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

	function handleExploreClick(chainId, transactionHash) {
		const cid = chainId;
		let chain;
		for (const c in ChainsConfig) {
			if (cid === ChainsConfig[c].chainId.toString()) {
				chain = ChainsConfig[c];
			}
		}
		const url = `${chain.blockExplorerUrls[0]}transaction/${transactionHash}`;
		window.open(url);
	}

	return (
		<BoxShadow>
			<Stack>
				<ListItem
					secondaryAction={
						<Stack direction={"row"} alignItems={"center"}>
							{(event.transaction_hash === "0x0" || event.value !== 0) && (
								<h4>{web3.utils.fromWei(event.value.toString())} SHM</h4>
							)}
							<IconButton
								onClick={() =>
									handleExploreClick(asset.chain_id, event.transaction_hash)
								}
							>
								<FiExternalLink />
							</IconButton>
						</Stack>
					}
				>
					<ListItemText
						primary={
							<Stack>
								<Stack direction={"row"}>
									<Stack>
										<Stack direction={"row"}>
											<Typography variant='h3' color={"black"}>
												{event.from === NULL_ADDRESS
													? "Minted"
													: `${event.method}`}
												{event.from === NULL_ADDRESS ? (
													""
												) : (
													<small>(transfer)</small>
												)}
											</Typography>
										</Stack>
										<Stack direction={"row"}>
											<Typography
												onClick={() => navigate(`/${event.from}`)}
												variant='h6'
												color={"text.primary"}
												sx={{ cursor: "pointer" }}
											>
												{`From @${`${event.from.substring(
													0,
													4
												)}...${event.from.slice(-4)}`} To`}
											</Typography>
											<Typography
												onClick={() => navigate(`/${event.to}`)}
												variant='h6'
												color={"text.primary"}
												sx={{ cursor: "pointer" }}
											>
												&nbsp;
												{`@${`${event.to.substring(0, 4)}...${event.to.slice(
													-4
												)}`}`}
											</Typography>
										</Stack>
									</Stack>

									<br />
								</Stack>
								<p style={{ fontSize: "10px", fontWeight: "500" }}>
									{`${new Date(event.timestamp).toDateString()}, ${new Date(
										event.timestamp
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

	return <Typography variant='h6'>{`(Expires in ${expiringIn})`}</Typography>;
};
