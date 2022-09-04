import {
	Box,
	Button,
	Divider,
	Typography,
	Card,
	CardContent,
	CardActions,
	CardActionArea,
	Grid,
	Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import Meetjson from "../contracts/Meet.json";
import { useNavigate, useParams } from "react-router-dom";
const contractAddress = process.env.REACT_APP_IRL_CONTRACT;

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
};

export const IRLActivityScreen = () => {
	const { irlId } = useParams();
	const [loading, setLoading] = useState(false);
	const [activities, setActivities] = useState([]);
	const [qrData, setQrData] = useState("");
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			fetchIRL();
		}, 500);
	}, []);

	const handleOpen = (id) => {
		activities.forEach((ele) => {
			if (ele.id === id) {
				setQrData(
					`${process.env.REACT_APP_BASE_URL}/irls/interact/${irlId}/${id}`
				);
			}
		});
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	const fetchIRL = async () => {
		try {
			setLoading(true);
			const contractInstance = new window.web3.eth.Contract(
				Meetjson.abi,
				contractAddress
			);
			const user = await JSON.parse(localStorage.getItem("user"));
			if (!user) {
				alert("Please connect metamask.");
				navigate("/");
			}
			let count = await contractInstance.methods
				.activityCount(irlId)
				.call({ from: user.address });
			for (let i = 1; i <= count; i++) {
				let data = await contractInstance.methods.activities(irlId, i).call();
				setActivities((activities) => [...activities, data]);
			}
			setLoading(false);
		} catch (error) {
			console.log("error in fetch irl", error.message, error.stack);
		}
	};

	return (
		<Box>
			<NavbarComponent />
			<Divider />
			<Box
				height={loading ? "" : "55vh"}
				p={4}
				display="flex"
				alignItems="center"
				flexDirection="column"
			>
				<Box p={1}>
					<Typography variant="h2">Activities</Typography>
				</Box>
				<Grid container spacing={0}>
					{activities.length > 0 &&
						activities.map((ele, i) => {
							return (
								<Card
									sx={{ maxWidth: 345, padding: "5px",m:1 }}
									variant="outlined"
									key={i}
								>
									<CardActionArea>
										<CardContent>
											<Typography gutterBottom variant="h5">
												{ele.name}
											</Typography>
											<Typography variant="h5">
												Reward : {window.web3.utils.fromWei(ele.award)} SHM
											</Typography>
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Button
											size="small"
                                            variant="contained"
											onClick={() => handleOpen(ele.id)}
										>
											Print
										</Button>
									</CardActions>
								</Card>
							);
						})}
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Scan To Participate
							</Typography>
							<Box style={{ background: "white", padding: "16px" }}>
								<QRCode value={qrData} />
							</Box>
							<Button onClick={handleClose}>Close</Button>
						</Box>
					</Modal>
				</Grid>
			</Box>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
