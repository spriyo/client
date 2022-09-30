import { Box, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { CollectionHttpService } from "../../../api/v2/collection";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { FooterComponent } from "../../../components/FooterComponent";
import { ImportFile } from "../../../components/ImportFile";
import { NavbarComponent } from "../../../components/navBar/NavbarComponent";
import FactoryContract from "../../../contracts/Factory.json";
import { getWalletAddress } from "../../../utils/wallet";
import { useNavigate } from "react-router-dom";

export const Create = () => {
	const [logoFile, setLogoFile] = useState(null);
	const [bannerFile, setBannerFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [factoryContract, setFactoryContract] = useState(null);
	const collectionHttpService = new CollectionHttpService();
	const navigate = useNavigate();
	const [formInput, updateFormInput] = useState({
		name: "",
		uname: "",
		description: "",
		symbol: "",
		chain_id: "8080",
		socials: [
			{ type: "website", url: "" },
			{ type: "discord", url: "" },
			{ type: "twitter", url: "" },
		],
	});

	function onSocialChange(index, e) {
		let socials = formInput.socials;
		socials[index].url = e.target.value;

		updateFormInput({
			...formInput,
			socials,
		});
	}

	function validateForm() {
		let valid = false;
		try {
			if (!formInput.name) {
				toast("Please enter collection name!", { type: "error" });
			} else if (!formInput.symbol) {
				toast("Please enter collection symbol!", { type: "error" });
			} else if (!formInput.uname) {
				toast("Please enter collections's uname!", { type: "error" });
			} else if (!formInput.description) {
				toast("Please enter collection's description", {
					type: "error",
				});
			} else if (!logoFile) {
				toast("Please add logo!", {
					type: "error",
				});
			} else if (!bannerFile) {
				toast("Please add banner image!", {
					type: "error",
				});
			} else {
				valid = true;
			}
			return valid;
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
	}

	async function createContract() {
		try {
			setLoading(true);
			const valid = validateForm();
			if (!valid) return;

			const currentAddress = await getWalletAddress();
			// Contract Creation
			const transaction = await factoryContract.methods
				.createContract(formInput.name, formInput.symbol)
				.send({ from: currentAddress });
			const contractAddress =
				transaction.events.ContractCreation.returnValues.contractAddress;

			// Formdata
			var formData = new FormData();
			formData.append("collectionimg", logoFile);
			formData.append("collectionbannerimg", bannerFile);
			formData.set("address", contractAddress);
			formData.set("symbol", formInput.symbol);
			formData.set("name", formInput.name);
			formData.set("chain_id", formInput.chain_id);
			formData.set("uname", formInput.uname);
			formData.set("description", formInput.description);
			for (let i in formInput.socials) {
				for (let key in formInput.socials[i]) {
					formData.append(`socials[${i}][${key}]`, formInput.socials[i][key]);
				}
			}

			// Collection Creation
			const resolved = await collectionHttpService.createCollection(formData);
			setLoading(false);
			if (!resolved.error) {
				toast("Successfully created an collection", { type: "success" });
				navigate("/");
			}
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
	}

	async function initializeFactoryContract() {
		try {
			const contract = new window.web3.eth.Contract(
				FactoryContract.abi,
				FactoryContract.networks["8080"].address
			);
			setFactoryContract(contract);
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
	}

	useEffect(() => {
		initializeFactoryContract();
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
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
					p: 2,
				}}
			>
				<Typography variant="h1" sx={{ fontSize: "30px" }}>
					Create Collection
				</Typography>
				<br />
				<Box
					sx={{
						width: {
							md: "50vw",
							xs: "95vw",
						},
						flexDirection: "column",
						display: "flex",
						alignItems: "center",
					}}
				>
					{/* Name */}
					<Box className="data-container-field">
						<Typography variant="h3">Name</Typography>
						<input
							type="text"
							placeholder="Enter your collection name"
							onChange={(e) =>
								updateFormInput({ ...formInput, name: e.target.value })
							}
						/>
					</Box>
					{/* Symbol */}
					<Box className="data-container-field">
						<Typography variant="h3">Symbol</Typography>
						<input
							type="text"
							placeholder="Enter your collection symbol"
							onChange={(e) =>
								updateFormInput({ ...formInput, symbol: e.target.value })
							}
						/>
					</Box>
					{/* Unique name */}
					<Box className="data-container-field">
						<Typography variant="h3">Unique Name</Typography>
						<input
							type="text"
							placeholder="Unique name for your collection"
							onChange={(e) =>
								updateFormInput({ ...formInput, uname: e.target.value })
							}
						/>
						<Typography style={{ marginBottom: "12px" }} variant="h6">
							<span style={{ color: "grey" }}>
								{`https://spriyo.xyz/collections/`}
								{formInput.uname === "" ? "themonkeys" : ""}
							</span>
							{formInput.uname}
						</Typography>
					</Box>
					{/* Description */}
					<Box className="data-container-field">
						<Typography variant="h3">Description</Typography>
						<textarea
							type="text"
							rows="5"
							placeholder="Enter description"
							onChange={(e) =>
								updateFormInput({ ...formInput, description: e.target.value })
							}
						/>
					</Box>
					<Box>
						<Typography variant="h3">Logo</Typography>
						<Box mt={0.5}>
							<ImportFile
								onFileChange={(f) => setLogoFile(f)}
								width="120px"
								height="120px"
							/>
						</Box>
						&nbsp;
						<Typography variant="h3">Banner Image</Typography>
						<Box mt={0.5}>
							<ImportFile
								onFileChange={(f) => setBannerFile(f)}
								width="380px"
								height="120px"
							/>
						</Box>
						&nbsp;
					</Box>
					{/* Socials */}
					<Box className="data-container-field" sx={{ textAlign: "center" }}>
						<Typography variant="h3">Socials</Typography>
						<input
							type="text"
							placeholder="Website URL"
							onChange={(e) => onSocialChange(0, e)}
						/>
						<input
							type="text"
							placeholder="Discord URL"
							onChange={(e) => onSocialChange(1, e)}
						/>
						<input
							type="text"
							placeholder="Twitter handle"
							onChange={(e) => onSocialChange(2, e)}
						/>
					</Box>
					<Box className="createscreen-create-button" sx={{ width: "20vw" }}>
						<ButtonComponent
							text={!loading ? "Create" : "loading..."}
							onClick={() => {
								createContract();
							}}
							sx={{ width: "100%" }}
						/>
					</Box>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
};
