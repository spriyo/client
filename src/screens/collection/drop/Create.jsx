import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	Box,
	FormControl,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { FooterComponent } from "../../../components/FooterComponent";
import { NavbarComponent } from "../../../components/navBar/NavbarComponent";
import { ImportFile } from "../../../components/ImportFile";
import { CollectionHttpService } from "../../../api/v2/collection";
import { CgAddR } from "react-icons/cg";
import { DropHttpService } from "../../../api/v2/drop";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { NftStorageHttpService } from "../../../api/nftStorage";

export const Create = () => {
	const user = useSelector((state) => state.authReducer.user);
	const dropHttpService = new DropHttpService();
	const [collectionSelectValue, setCollectionSelectValue] = useState("");
	const collectionHttpService = new CollectionHttpService();
	const nftStorageHttpService = new NftStorageHttpService();
	const [collections, setCollections] = useState([]);
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const [formInput, updateFormInput] = useState({
		title: "",
		description: "",
		contract_address: "",
		amount: "",
		collection_id: "",
	});

	function validateForm() {
		let valid = true;
		try {
			for (let key in formInput) {
				if (formInput[key] === "") {
					throw new Error(`Please enter ${key.replace("_", " ")}`);
				}
			}
			if (collectionSelectValue === "")
				throw new Error("Please select a collection");
			else if (!image) throw new Error("Please add your NFT");
		} catch (error) {
			valid = false;
			toast(error.message, {
				type: "error",
			});
		}
		return valid;
	}

	async function uploadToIPFS(file) {
		try {
			// 1. Upload file to ipfs
			const assetURL = await nftStorageHttpService.pinFileToIPFS(file);

			// 2. Upload data to ipfs
			const metaDataURL = await nftStorageHttpService.pinJSONToIPFS(
				{ title: formInput.title, description: formInput.description },
				assetURL
			);

			return { metaDataURL, assetURL };
		} catch (error) {
			toast(error.message, { type: "error" });
		}
	}

	async function createDrop() {
		if (loading) return;
		try {
			setLoading(true);
			const isValid = validateForm();
			if (!isValid) {
				setLoading(false);
				return;
			}
			const { metaDataURL, assetURL } = await uploadToIPFS(image);
			const formData = new FormData();
			for (let key in formInput) {
				formData.set(key, formInput[key]);
			}
			formData.append("image", image);
			formData.set("metadata_url", metaDataURL);
			let metadata = {
				name: formInput.title,
				description: formInput.description,
				image: assetURL,
			};
			for (let previewKey in metadata) {
				formData.append(`metadata[${previewKey}]`, metadata[previewKey]);
			}

			const resolved = await dropHttpService.createDrop(formData);
			if (!resolved.error) {
				toast("Drop created successfully", { type: "success" });
				navigate("/");
			} else if (resolved.error) {
				toast(resolved.data.data.message, { type: "error" });
			}
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
		setLoading(false);
	}

	async function getCollections() {
		try {
			const resolved = await collectionHttpService.getCollections({
				user_address: user.address,
			});
			if (!resolved.error) {
				setCollections(resolved.data);
			}
		} catch (error) {
			toast(error.message);
		}
	}

	const handleChange = async (event) => {
		updateFormInput({ ...formInput, collection_id: event.target.value });
		setCollectionSelectValue(event.target.value);
	};

	useEffect(() => {
		if (user) getCollections();
	}, [user]);

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
					Create Drop
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
					{/* Title */}
					<Box className="data-container-field">
						<Typography variant="h3">Title</Typography>
						<input
							type="text"
							placeholder="Drop title"
							onChange={(e) =>
								updateFormInput({ ...formInput, title: e.target.value })
							}
						/>
					</Box>
					{/* Description */}
					<Box className="data-container-field">
						<Typography variant="h3">Description</Typography>
						<input
							type="text"
							placeholder="Description about your drop"
							onChange={(e) =>
								updateFormInput({ ...formInput, description: e.target.value })
							}
						/>
					</Box>
					{/* Contract Address */}
					<Box className="data-container-field">
						<Typography variant="h3">Contract Address</Typography>
						<input
							type="text"
							placeholder="Contract Address"
							onChange={(e) =>
								updateFormInput({
									...formInput,
									contract_address: e.target.value,
								})
							}
						/>
					</Box>
					{/* Amount */}
					<Box className="data-container-field">
						<Typography variant="h3">Amount</Typography>
						<input
							type="number"
							placeholder="Enter amount in SHM"
							onChange={(e) =>
								updateFormInput({ ...formInput, amount: e.target.value })
							}
						/>
					</Box>
					{/* Image */}
					<Box
						className="data-container-field"
						width={"50vw"}
						sx={{ minWidth: "200px", maxWidth: "400px" }}
					>
						<Typography variant="h3">NFT</Typography>
						<Box
							sx={{
								mt: 0.5,
								textAlign: "center",
								height: "300px",
							}}
						>
							<ImportFile onFileChange={(f) => setImage(f)} />
						</Box>
					</Box>
					{/* Collection */}
					<Box
						className="data-container-field"
						mt={2}
						width={"50vw"}
						sx={{
							minWidth: 200,
							maxWidth: 400,
						}}
						textAlign="start"
					>
						<Typography variant="h3">Collection</Typography>
						<FormControl
							sx={{ width: "50vw", minWidth: 200, maxWidth: 400 }}
							size="small"
						>
							<Select
								displayEmpty
								labelId="collection-select-small"
								id="collection-select-small"
								value={collectionSelectValue}
								onChange={handleChange}
							>
								<MenuItem disabled value="">
									<em>Select Collection</em>
								</MenuItem>
								<Box m={1}>
									<Typography variant="h5">Your Collections</Typography>
								</Box>
								{collections.map((c, i) => {
									return (
										<MenuItem value={c._id} key={i}>
											<Box display={"flex"}>
												<img
													height="25px"
													src={c.image}
													alt="logo"
												/>
												<Box pl={1}>{c.name}</Box>
											</Box>
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						{/* Create Collection */}
						<Stack
							my={1}
							flexDirection="row"
							alignItems="center"
							onClick={() => {
								navigate("/collections/create");
							}}
							sx={{ color: "blue", cursor: "pointer" }}
						>
							<Typography variant="h5">Create Collection</Typography>
							<Box ml={0.5}>
								<CgAddR />
							</Box>
						</Stack>
					</Box>
					<Box className="createscreen-create-button" sx={{ width: "20vw" }}>
						<ButtonComponent
							text={loading ? "Loading..." : "Create"}
							onClick={createDrop}
							sx={{ width: "100%" }}
						/>
					</Box>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
};
