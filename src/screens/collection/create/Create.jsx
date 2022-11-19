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
// import FactoryContract from "../../../contracts/Factory.json";
// import { getWalletAddress } from "../../../utils/wallet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validURL } from "../../../utils/validURL";
import { resolve } from "../../../utils/resolver";

export const Create = () => {
	const [searchParams] = useSearchParams();
	const [logoFile, setLogoFile] = useState(null);
	const [bannerFile, setBannerFile] = useState(null);
	const [loading, setLoading] = useState(false);
	// const [factoryContract, setFactoryContract] = useState(null);
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
			{ type: "telegram", url: "" },
		],
	});

	async function getCollection() {
		try {
			const contractAddress = searchParams.get("contract_address");
			const resolved = await collectionHttpService.getCollection(
				contractAddress
			);
			console.log(resolved);
			if (!resolved.error) {
				// Update Socials
				formInput.socials.forEach((k, i) => {
					const index = resolved.data.socials
						.map((e) => e.type)
						.indexOf(k.type);
					if (index === -1) {
						resolved.data.socials[i] = k;
					}
				});
				// Update Images
				setBannerFile(resolved.data.banner_image);
				setLogoFile(resolved.data.image);
				updateFormInput(resolved.data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	function onSocialChange(index, e) {
		let socials = formInput.socials;
		socials[index].url = e.target.value;

		updateFormInput({
			...formInput,
			socials,
		});
	}

	function getSocialValue(k) {
		const index = formInput.socials.map((e) => e.type).indexOf(k);
		return formInput.socials[index].url;
	}

	function validateForm() {
		let valid = false;
		try {
			if (!formInput.name) {
				toast("Please enter collection name!", { type: "error" });
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
			if (!valid) {
				setLoading(false);
				return;
			}
			var formData = new FormData();

			// Socials validations
			for (let i in formInput.socials) {
				for (let key in formInput.socials[i]) {
					if (formInput.socials[i]["url"] !== "") {
						if (validURL(formInput.socials[i]["url"])) {
							formData.append(
								`socials[${i}][${key}]`,
								formInput.socials[i][key]
							);
						} else {
							throw new Error(
								`Please enter valid ${formInput.socials[i]["url"]} address`
							);
						}
					}
				}
			}

			// const currentAddress = await getWalletAddress();
			// Contract Creation
			// const transaction = await factoryContract.methods
			// 	.createContract(formInput.name, formInput.symbol)
			// 	.send({ from: currentAddress });
			// const contractAddress =
			// 	transaction.events.ContractCreation.returnValues.contractAddress;

			const contractAddress = searchParams.get("contract_address");

			// Formdata
			formData.append("collectionimg", logoFile);
			formData.append("collectionbannerimg", bannerFile);
			formData.set("address", contractAddress);
			formData.set("name", formInput.name);
			formData.set("chain_id", formInput.chain_id);
			formData.set("uname", formInput.uname);
			formData.set("description", formInput.description);

			// Collection Creation
			const resolved = await collectionHttpService.createCollection(formData);
			if (!resolved.error) {
				toast("Successfully created an collection", { type: "success" });
				navigate("/");
			}
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
		setLoading(false);
	}

	// async function initializeFactoryContract() {
	// 	try {
	// 		const contract = new window.web3.eth.Contract(
	// 			FactoryContract.abi,
	// 			FactoryContract.networks["8080"].address
	// 		);
	// 		setFactoryContract(contract);
	// 	} catch (error) {
	// 		toast(error.message, { type: "warning" });
	// 	}
	// }

	useEffect(() => {
		// initializeFactoryContract();
		getCollection();
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
					Edit Collection
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
							value={formInput.name}
							type="text"
							placeholder="Enter your collection name"
							onChange={(e) =>
								updateFormInput({ ...formInput, name: e.target.value })
							}
						/>
					</Box>
					{/* Unique name */}
					<Box className="data-container-field">
						<Typography variant="h3">Unique Name</Typography>
						<input
							value={formInput.uname}
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
							value={formInput.description}
							type="text"
							rows="5"
							placeholder="Enter description"
							onChange={(e) =>
								updateFormInput({ ...formInput, description: e.target.value })
							}
						/>
					</Box>
					<Box width={"50vw"} sx={{ minWidth: "200px", maxWidth: "400px" }}>
						<Typography variant="h3">Logo</Typography>
						<Box
							mt={0.5}
							sx={{
								mt: 0.5,
								textAlign: "center",
								height: "200px",
							}}
						>
							<ImportFile
								onFileChange={(f) => setLogoFile(f)}
								defaultContentURL={logoFile}
							/>
						</Box>
						&nbsp;
						<Typography variant="h3">Banner Image</Typography>
						<Box
							mt={0.5}
							sx={{
								mt: 0.5,
								textAlign: "center",
								height: "150px",
							}}
						>
							<ImportFile
								onFileChange={(f) => setBannerFile(f)}
								defaultContentURL={bannerFile}
							/>
						</Box>
						&nbsp;
					</Box>
					{/* Socials */}
					<Box className="data-container-field" sx={{ textAlign: "center" }}>
						<Typography variant="h3">Socials</Typography>
						<input
							value={getSocialValue("website")}
							type="text"
							placeholder="Website URL"
							onChange={(e) => onSocialChange(0, e)}
						/>
						<input
							value={getSocialValue("discord")}
							type="text"
							placeholder="Discord URL"
							onChange={(e) => onSocialChange(1, e)}
						/>
						<input
							value={getSocialValue("twitter")}
							type="text"
							placeholder="Twitter handle"
							onChange={(e) => onSocialChange(2, e)}
						/>
						<input
							value={getSocialValue("telegram")}
							type="text"
							placeholder="Telegram channel"
							onChange={(e) => onSocialChange(3, e)}
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
