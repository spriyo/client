import {
	Box,
	Button,
	Divider,
	Typography,
	Card,
	CardContent,
	CardActions,
	CardActionArea,
	CardMedia,
	Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import Meetjson from "../contracts/Meet.json";
import { useNavigate } from "react-router-dom";
const contractAddress = process.env.REACT_APP_IRL_CONTRACT;

export const IRLScreen = () => {
	const [loading, setLoading] = useState(false);
	const [irls, setIrls] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			fetchIRL();
		}, 500);
	}, []);

	const redirectToActivity = (id) => {
		try {
			navigate(`/irls/${id}`);
		} catch (error) {
			console.log(error);
		}
	};

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
			let checkAdmin = await contractInstance.methods
				.admins(user.address)
				.call();
			setIsAdmin(checkAdmin);
			let count = await contractInstance.methods.irlCount().call();
			for (let i = 1; i <= count; i++) {
				let data = await contractInstance.methods.irls(i).call();
				setIrls((irls) => [...irls, data]);
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
					<Typography variant="h2">IRLs</Typography>
				</Box>
				<Grid container spacing={0}>
					{irls.length >= 1 &&
						irls.map((ele, i) => {
							return (
								<Card
									sx={{ maxWidth: 345, m: 1 }}
									style={{ padding: "5px" }}
									key={i}
									variant="outlined"
								>
									<CardActionArea>
										<CardMedia
											component="img"
											height="140"
											image={ele.image}
											alt={ele.name}
										/>
										<CardContent>
											<Typography gutterBottom variant="h5" component="div">
												{ele.name}
											</Typography>
										</CardContent>
									</CardActionArea>
									{isAdmin && (
										<CardActions>
											<Button
												size="small"
												variant="contained"
												onClick={() => redirectToActivity(ele.id)}
											>
												Activity
											</Button>
										</CardActions>
									)}
								</Card>
							);
						})}
				</Grid>
			</Box>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
