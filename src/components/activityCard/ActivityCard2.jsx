import {
	Box,
	IconButton,
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
import { FiExternalLink } from "react-icons/fi";
import {
	ChainsConfig,
	ERC1155_BATCH_TRANSFER_EVENT_HASH,
	ERC1155_TRANSFER_EVENT_HASH,
	ERC721_TRANSFER_EVENT_HASH,
	NULL_ADDRESS,
	SALE_EVENT_HASH,
} from "../../constants";
import { getShortAddress } from "../../utils/addressShort";

const BoxShadow = styled(Box)(({ theme }) => ({
	boxShadow: theme.shadows[0],
	margin: "4px 0",
	border: "1px solid #ebebeb",
	borderRadius: "10px",
}));

export function ActivityCardComponent2({ event, asset }) {
	// const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const web3 = new Web3();
	const saleTypes = [
		"Created Sale",
		"Accepted Sale",
		"Updated Sale",
		"Canceled Sale",
	];

	function getKeyword(event) {
		switch (event.log.topics[0]) {
			case ERC1155_BATCH_TRANSFER_EVENT_HASH:
			case ERC1155_TRANSFER_EVENT_HASH:
			case ERC721_TRANSFER_EVENT_HASH:
				return event.from === NULL_ADDRESS ? "Minted" : "Transfer";
			case SALE_EVENT_HASH:
				const data = web3.eth.abi.decodeParameters(
					["uint", "uint256", "address", "uint8"],
					event.data
				);
				const type = web3.utils.hexToNumberString(event.log.topics[3]);
				return `${saleTypes[type]} for ${web3.utils.fromWei(data[1])} SHM`;
			case "sale_update_price":
				return "Buy Now Price Updated";
			case "0xa59ac6dd": // buy
				return (
					<>
						Bought by{" "}
						<small style={{ cursor: "pointer" }}>
							{getShortAddress(event.to)}
						</small>
					</>
				);
			case "0xb62deb65":
				return "Listing Canceled";
			case "transfer":
				return "Transfered";
			default:
				return event.to === NULL_ADDRESS ? "Burn" : "Transfer";
		}
	}

	function decodeParameters(event) {
		switch (event.method) {
			case "0x798bac8d": // Set Buy Price
				return web3.eth.abi.decodeParameters(
					[
						{ type: "address", name: "contract_address" },
						{ type: "uint256", name: "item_id" },
						{ type: "uint256", name: "amount" },
					],
					`0x${event.input.substring(10)}`
				);
			case "0xa59ac6dd": // Buy
				return web3.eth.abi.decodeParameters(
					[
						{ type: "address", name: "contract_address" },
						{ type: "uint256", name: "item_id" },
						{ type: "uint256", name: "sale_id" },
					],
					`0x${event.input.substring(10)}`
				);
			default:
				return 0;
		}
	}

	function getPrice(event) {
		switch (event.method) {
			case "0x798bac8d":
				const decodedResult = decodeParameters(event);
				return web3.utils.fromWei(decodedResult.amount);
			default:
				return 0;
		}
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
							{
								<h4>{`${
									getPrice(event) !== 0 ? getPrice(event) + " SHM" : ""
								}`}</h4>
							}
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
												{getKeyword(event)}
												{event.from === NULL_ADDRESS ? "" : <small></small>}
											</Typography>
										</Stack>
										<Stack direction={"row"}>
											<Typography
												onClick={() => navigate(`/${event.from}`)}
												variant='h6'
												color={"text.primary"}
												sx={{ cursor: "pointer" }}
											>
												{`Transfered ${event.supply} from @${getShortAddress(
													event.from
												)} to`}
											</Typography>
											<Typography
												onClick={() => navigate(`/${event.to}`)}
												variant='h6'
												color={"text.primary"}
												sx={{ cursor: "pointer" }}
											>
												&nbsp;
												{`@${getShortAddress(event.to)}`}
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
