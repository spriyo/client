import { Box, Dialog, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { getShortAddress } from "../utils/addressShort";
import { Oval } from "react-loader-spinner";
import ClaimIRL from "../assets/irl-claim-success.gif";

const TransactionDialogue = ({ transactionHash, transactionStatus }) => {
	const [closed, setClosed] = useState(false);
	const [transactionFinished, setTransactionFinished] = useState(false);

	useEffect(() => {
		if (transactionHash !== "") {
			setClosed(true);
			setTransactionFinished(false);
		}
		if (transactionStatus) {
			setTransactionFinished(true);
		}
	}, [transactionStatus, transactionHash]);

	return (
		<Dialog open={closed}>
			<Box p={2} px={4} textAlign={"center"}>
				<IconButton
					sx={{ position: "absolute", right: 2, top: 8 }}
					onClick={() => {
						window.location.reload();
					}}
				>
					<IoClose />
				</IconButton>
				<Box>
					<h3>
						{transactionFinished
							? "Transaction completed!"
							: "Your transaction is processing..."}
					</h3>
				</Box>
				<Box
					display={"flex"}
					alignItems='center'
					justifyContent={"center"}
					m={4}
				>
					{transactionFinished ? (
						<img src={ClaimIRL} alt='Success logo' height={"75px"} />
					) : (
						<Oval
							height={60}
							width={60}
							color='grey'
							wrapperClass=''
							visible={true}
							ariaLabel='oval-loading'
							secondaryColor='lightgrey'
							strokeWidth={2}
							strokeWidthSecondary={2}
						/>
					)}
				</Box>
				<Box mb={1.5}>
					<p style={{ fontWeight: "500" }}>
						{transactionFinished
							? "Your transaction is finished"
							: "Your transaction is processing. It should be confirmed on the blockchain shortly"}
					</p>
				</Box>
				<Box>
					<h5>TRANSACTION ID</h5>
					<a
						href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
						target='_blank'
						rel='noreferrer'
					>
						{getShortAddress(transactionHash)}
					</a>
				</Box>
			</Box>
		</Dialog>
	);
};

export default TransactionDialogue;
