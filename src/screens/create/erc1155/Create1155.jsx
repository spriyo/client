import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { NavbarComponent } from "../../../components/navBar/NavbarComponent";
import { FooterComponent } from "../../../components/FooterComponent";
import { AddFile } from "../../../components/AddFile";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { NftStorageHttpService } from "../../../api/nftStorage";
import { getWalletAddress } from "../../../utils/wallet";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NFTHttpService } from "../../../api/v2/nft";

export const Create1155 = () => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [formInput, updateFormInput] = useState({
		title: "",
		description: "",
		copies: "",
	});
	const nftStorageHttpService = new NftStorageHttpService();
	const nftHttpService = new NFTHttpService();
	const nftContract = useSelector(
		(state) => state.contractReducer.nft1155Contract
	);
	const stateChainId = useSelector((state) => state.walletReducer.chainId);
	const currentChainIdRef = useRef();
	const navigate = useNavigate();

	function onFileChange(f) {
		setFile(f);
	}

	async function uploadToIpfs() {
		if (loading) return;
		if (!file) return alert("Please upload your image☹️");
		if (!formInput.title || !formInput.description || !formInput.copies)
			return alert("Please fill all the fields😥");
		try {
			setLoading(true);

			// 1. Upload file to ipfs
			const assetUrl = await nftStorageHttpService.pinFileToIPFS(file);

			// 2. Upload data to ipfs
			const metaDataUrl = await nftStorageHttpService.pinJSONToIPFS(
				formInput,
				assetUrl
			);

			// 3. After file is uploaded to IPFS, pass the URL to mint it on chain
			const resolved = await mintAsset(metaDataUrl, formInput.copies, assetUrl);
			setLoading(false);

			// Redirect to home page
			if (!resolved.error) {
				navigate("/", { replace: true });
			}
		} catch (error) {
			alert(error.message);
		}
	}

	async function mintAsset(metaDataUrl, copies, assetUrl) {
		try {
			const currentAddress = await getWalletAddress();

			const transaction = await nftContract.methods
				.mint(currentAddress, copies, "0x")
				.send({ from: currentAddress });

			const resolved = await uploadToServer(
				transaction.to,
				parseInt(transaction.events.TransferSingle.returnValues.id),
				metaDataUrl,
				transaction.events.TransferSingle.returnValues.to,
				transaction.events.TransferSingle.returnValues.value,
				assetUrl
			);
			return resolved;
		} catch (error) {
			alert(error.message);
		}
	}

	async function uploadToServer(
		contractAddress,
		itemId,
		metaDataUrl,
		owner,
		value,
		assetUrl
	) {
		// 2. Upload data to ipfs
		const { title, description } = formInput;

		// Get chain details
		const chainId = currentChainIdRef.current;
		// Get contract details

		var formData = new FormData();
		formData.set("token_id", itemId);
		formData.set("contract_address", contractAddress);
		formData.set("type", "1155");
		formData.set("chain_id", chainId);
		formData.set("owner", owner);
		formData.set("metadata_url", metaDataUrl);
		formData.append("asset", file);
		formData.set("name", title);
		formData.set("description", description);
		formData.set("value", value);
		const metadata = { name: title, description, image: assetUrl }
		for (let previewKey in metadata) {
			formData.append(`metadata[${previewKey}]`, metadata[previewKey]);
		}

		const resolved = await nftHttpService.createNFT(formData);
		return resolved;
	}

	useEffect(() => {
		currentChainIdRef.current = stateChainId;
	}, [stateChainId]);

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
				}}
			>
				<Typography variant="h1" sx={{ fontSize: "30px" }}>
					Create New NFT
				</Typography>
				<Typography
					variant="h5"
					sx={{ fontSize: "18px", color: "text.primary" }}
				>
					Multiple Edition
				</Typography>
				<br />
				{/* Data */}
				<Box className="data-container">
					{/* Title */}
					<Box className="data-container-field">
						<p>Title</p>
						<input
							type="text"
							placeholder="Enter your NFT title"
							onChange={(e) =>
								updateFormInput({ ...formInput, title: e.target.value })
							}
						/>
					</Box>
					{/* Description */}
					<Box className="data-container-field">
						<p>Description</p>
						<textarea
							type="text"
							rows="5"
							placeholder="Enter description of the NFT"
							onChange={(e) =>
								updateFormInput({ ...formInput, description: e.target.value })
							}
						/>
					</Box>
					{/* Copies */}
					<Box className="data-container-field">
						<p>No.of Copies</p>
						<input
							type="number"
							placeholder="Eg. 5"
							onChange={(e) =>
								updateFormInput({ ...formInput, copies: e.target.value })
							}
						/>
					</Box>
				</Box>
				<br />
				<AddFile onFileChange={onFileChange} />
				{/* Create Button */}
				<Box className="createscreen-create-button" sx={{ width: "40vw" }}>
					<ButtonComponent
						text={!loading ? "Create" : "loading..."}
						onClick={uploadToIpfs}
						sx={{ width: "100%" }}
					/>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
};
