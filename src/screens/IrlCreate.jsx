import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IrlHttpService } from "../api/irl";
const MeetContract = require("../contracts/Meet.json");
const contractAddress = process.env.REACT_APP_IRL_CONTRACT;

export const IrlCreate = () => {
	const navigate = useNavigate();
	const [file, setFile] = useState();
	const [irls, setIrls] = useState([]);
	const [isActivity, setisActivity] = useState(false);
	const [selectedIrlId, setselectedIrlId] = useState("");
	const irlHttpService = new IrlHttpService();
	let irlName;
	let imageUrl;
	let activityName;
	let activityAward;

	async function checkAdmin() {
		try {
			const contractInstance = new window.web3.eth.Contract(
				MeetContract.abi,
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
			if (!checkAdmin) {
				navigate("/");
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function uploadImage() {
		try {
			if (!file) return;

			var formData = new FormData();
			formData.append("displayimg", file);

			const resolved = await irlHttpService.uploadIrlImage(formData);
			if (!resolved.error) {
				imageUrl = resolved.data.image;
				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.log(error.message);
			return false;
		}
	}

	async function createIrl() {
		try {
			const uploaded = await uploadImage();
			console.log(uploaded, imageUrl, irlName);

			if (!uploaded || !imageUrl || !irlName) return;
			const contract = new window.web3.eth.Contract(
				MeetContract.abi,
				contractAddress
			);
			const user = await JSON.parse(localStorage.getItem("user"));
			if (!user) {
				alert("Please connect metamask.");
				navigate("/");
			}

			await contract.methods
				.createIrl(imageUrl, irlName)
				.send({ from: user.address });
			navigate("/irls");
		} catch (error) {
			console.log(error);
		}
	}

	function onImageChange(e) {
		if (!e.target.files[0]) return;
		setFile(e.target.files[0]);
	}

	async function getIrls() {
		try {
			const contractInstance = new window.web3.eth.Contract(
				MeetContract.abi,
				contractAddress
			);

			let count = await contractInstance.methods.irlCount().call();
			for (let i = 1; i <= count; i++) {
				let data = await contractInstance.methods.irls(i).call();
				setIrls((irls) => [...irls, data]);
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function createActivity() {
		try {
			if (!activityName || !activityAward || !selectedIrlId) return;
			const contract = new window.web3.eth.Contract(
				MeetContract.abi,
				contractAddress
			);
			const user = await JSON.parse(localStorage.getItem("user"));
			if (!user) {
				alert("Please connect metamask.");
				navigate("/");
			}
			const award = window.web3.utils.toWei(activityAward);

			await contract.methods
				.createActivity(selectedIrlId, activityName, award)
				.send({ from: user.address });
			navigate("/irls");
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		setTimeout(() => {
			checkAdmin();
			getIrls();
		}, 500);
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
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{isActivity ? (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							border: "2px solid grey",
							borderRadius: "8px",
							p: 2,
							borderStyle: "dashed",
						}}
					>
						<Box m={1}>
							<h2>Create IRL</h2>
						</Box>
						<Box>
							{file ? (
								<img
									src={window.URL.createObjectURL(file)}
									alt="IRL Image"
									height="100px"
									width="200px"
								/>
							) : (
								<Box
									height="100px"
									width="200px"
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										backgroundColor: "#f0f0f0",
										borderRadius: "8px",
									}}
								>
									<small>Add Image</small>
								</Box>
							)}
						</Box>
						<Box m={1} sx={{ width: "-webkit-fill-available" }}>
							<label htmlFor="file-upload" className="custom-file-upload">
								<input
									type="file"
									name="Asset"
									id="file-upload"
									onChange={onImageChange}
									style={{ display: "none" }}
								/>
								<Box
									sx={{
										p: 0.4,
										border: "1px solid grey",
										cursor: "pointer",
										width: "100%",
										textAlign: "center",
										fontWeight: "medium",
									}}
								>
									{`${file ? "Change Image" : "Upload Image"}`}
								</Box>
							</label>
						</Box>
						<input
							type="text"
							placeholder="Event name"
							onChange={(e) => (irlName = e.target.value)}
							style={{ padding: "4px" }}
						/>
						<Box m={1} mt={2} sx={{ width: "-webkit-fill-available" }}>
							<Button
								size="small"
								variant="contained"
								endIcon={<IoChevronForwardOutline />}
								onClick={() => createIrl()}
								sx={{ width: "100%" }}
							>
								Create
							</Button>
						</Box>
					</Box>
				) : (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							border: "2px solid grey",
							borderRadius: "8px",
							p: 2,
							borderStyle: "dashed",
						}}
					>
						<Box m={1}>
							<h2>Create Activity</h2>
						</Box>
						<Box>
							<FormControl sx={{ minWidth: 120 }} size="small">
								<InputLabel id="select-small">Select IRL</InputLabel>
								<Select
									labelId="select-small"
									id="select-small"
									value={selectedIrlId}
									label="IRL"
									onChange={(event) => {
										setselectedIrlId(event.target.value);
									}}
								>
									{irls.map((i) => (
										<MenuItem value={i.id}>{i.name}</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
						<Box mt={1}>
							<input
								type="text"
								placeholder="Activity Name"
								onChange={(e) => (activityName = e.target.value)}
								style={{ width: "120px", padding: "4px" }}
							/>
						</Box>
						<Box mt={1}>
							<input
								type="text"
								placeholder="Award in SHM"
								onChange={(e) => (activityAward = e.target.value)}
								style={{ width: "120px", padding: "4px" }}
							/>
						</Box>
						<Box m={1} mt={2}>
							<Button
								size="small"
								variant="contained"
								endIcon={<IoChevronForwardOutline />}
								onClick={() => createActivity()}
								sx={{ minWidth: "120px" }}
							>
								Create
							</Button>
						</Box>
					</Box>
				)}
				<Box m={1}>
					<small>
						<span>
							{isActivity
								? "Want to create an activity?"
								: "Want to create an IRL?"}
							&nbsp;
						</span>
						<span
							style={{
								fontWeight: "bold",
								color: "blue",
								textDecoration: "underline",
								cursor: "pointer",
							}}
							onClick={() => setisActivity((a) => !a)}
						>
							{isActivity ? "Add Activity" : "Create IRL"}
						</span>
					</small>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
};
