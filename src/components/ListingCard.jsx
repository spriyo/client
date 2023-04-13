import { ListItem, ListItemText, Stack, styled, Box } from "@mui/material";
import React, { useState } from "react";
import Web3 from "web3";
import { BuyDialogue } from "../components/BuyDialogue";
import { getSymbolFromAddress } from "../utils/getSymbolFromAddress";

const BoxShadow = styled(Box)(({ theme }) => ({
	boxShadow: theme.shadows[0],
	margin: "4px 0",
	border: "1px solid #ebebeb",
	borderRadius: "10px",
}));

export const ListingCard = ({ listing }) => {
	const [buyDialogueOpen, setBuyDialogueOpen] = useState(false);
	function onClose() {
		setBuyDialogueOpen(false);
	}

	return (
		<div>
			<BoxShadow>
				<Box>
					<Stack>
						<BuyDialogue
							isOpen={buyDialogueOpen}
							listing={listing}
							onClose={onClose}
						/>
						<ListItem
							secondaryAction={
								<Box
									p={1}
									borderRadius={"4px"}
									backgroundColor="#00e472"
									sx={{ cursor: "pointer" }}
									onClick={() => setBuyDialogueOpen(true)}
								>
									<h5>Buy</h5>
								</Box>
							}
						>
							<ListItemText
								primary={
									<Box display={"flex"} alignItems={"center"}>
										<h4>
											{Web3.utils.fromWei(listing.pricePerToken)}{" "}
											{getSymbolFromAddress(listing.currency)}
										</h4>
										<h6>&nbsp; per unit</h6>
									</Box>
								}
								secondary={`${listing.quantity} Available`}
							/>
						</ListItem>
					</Stack>
				</Box>
			</BoxShadow>
		</div>
	);
};
