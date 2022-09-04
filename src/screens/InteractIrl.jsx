import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import SuccessLogo from "../assets/irl-claim-success.gif";
import ClaimIRL from "../assets/claim-irl.gif";
import { FooterComponent } from "../components/FooterComponent";
import { useState } from "react";
import { IoChevronForwardOutline } from "react-icons/io5";
const MultisigContract = require("../contracts/Meet.json");
const contractAddress = process.env.REACT_APP_IRL_CONTRACT;

export const InteractIrl = () => {
	const navigate = useNavigate();
	const { irlId, activityId } = useParams();
	const [activity, setActivity] = useState(null);
	const [success, setSuccess] = useState(false);
	const [claimed, setClaimed] = useState(false);

	async function signTransaction() {
		try {
			const address = await getAddress();
			if (!irlId || !activityId) return;
			const contract = new window.web3.eth.Contract(
				MultisigContract.abi,
				contractAddress
			);

			await contract.methods
				.interact(irlId, activityId)
				.send({ from: address });
			setSuccess(true);
		} catch (error) {
			alert(error.message);
		}
	}

	async function getActivity() {
		try {
			const contract = new window.web3.eth.Contract(
				MultisigContract.abi,
				contractAddress
			);
			const a = await contract.methods.activities(irlId, activityId).call();
			setActivity(a);
		} catch (error) {
			alert(error.message);
		}
	}

	async function checkClaimed() {
		try {
			const address = await getAddress();
			const contract = new window.web3.eth.Contract(
				MultisigContract.abi,
				contractAddress
			);
			const a = await contract.methods
				.activityInteractions(irlId, activityId, address)
				.call();
			setClaimed(a);
		} catch (error) {
			alert(error.message);
		}
	}

	async function getAddress() {
		try {
			const localUser = await JSON.parse(localStorage.getItem("user"));
			if (!localUser) {
				alert("Please connect metamask.");
				navigate("/");
			}
			return localUser.address;
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			checkClaimed();
			getActivity();
		}, 500);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				justifyContent: "start",
			}}
		>
			<NavbarComponent />
			<Box
				sx={{
					flexGrow: 1,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{!success ? (
					claimed ? (
						<h2>You have already claimed this offer😥</h2>
					) : (
						activity &&
						(activity.name === "" ? (
							<h2>Invalid Activity</h2>
						) : (
							<Stack alignItems={"center"}>
								<img src={ClaimIRL} alt="Success logo" height={"250px"} />
								<br />
								<Typography mb={0.5} variant={"h2"}>
									{activity.name}
								</Typography>

								<Typography variant={"h5"}>
									Please press continue to claim{" "}
									<span
										style={{ fontWeight: "bold" }}
									>{`${window.web3.utils.fromWei(
										activity.award.toString()
									)} SHM`}</span>
								</Typography>
								<Box mt={1} sx={{ "& button": { m: 1 } }}>
									<Button
										size="small"
										variant="contained"
										onClick={() => signTransaction()}
										endIcon={<IoChevronForwardOutline />}
										style={{ color: "white", fontWeight: "bold" }}
									>
										Continue
									</Button>
								</Box>
							</Stack>
						))
					)
				) : (
					<Box>
						<img src={SuccessLogo} alt="Success logo" height={"150px"} />
						<br />
						<Typography textAlign={"center"} variant={"h4"}>
							Success🥳
						</Typography>
					</Box>
				)}
			</Box>
			<FooterComponent />
		</Box>
	);
};
