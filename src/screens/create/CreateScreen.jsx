import "./CreateScreen.css";
import nftJsonInterface from "../../contracts/NFT.json";

import { React, useEffect, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { AssetHttpService } from "../../api/asset";
import { getWalletAddress, getChainId } from "../../utils/wallet";
import { uploadFileToIpfs, uploadJsonToIpfs } from "../../utils/ipfs";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { ChainsConfig } from "../../constants";

export function CreateScreen({ closeModal }) {
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const assetHttpService = new AssetHttpService();
	const [formInput, updateFormInput] = useState({
		title: "",
		description: "",
	});
	const [chainName, setChainName] = useState("");
	const chainId = useSelector((state) => state.walletReducer.chainId);
	async function getChainName() {
		let foundChain;
		const currentChainIdHex = await getChainId();
		for (var key in ChainsConfig) {
			if (ChainsConfig[key].chainId === currentChainIdHex) {
				foundChain = ChainsConfig[key].chainName;
			}
		}
		setChainName(foundChain);
	}

	async function uploadToIpfs() {
		if (loading) return;
		try {
			const { title, description } = formInput;
			if (!title || !description || !file)
				return alert("Please ensure everything is filled.");
			setLoading(true);

			// 1. Upload file to ipfs
			const assetUrl = await uploadFileToIpfs(file);

			// 2. Upload data to ipfs
			const metaDataUrl = await uploadJsonToIpfs(formInput, assetUrl);

			// 3. After file is uploaded to IPFS, pass the URL to mint it on chain
			await mintAsset(metaDataUrl);
			setLoading(false);

			// Redirect to home page
			navigate("/", { replace: true });
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	async function mintAsset(metaDataUrl) {
		try {
			if (!metaDataUrl) return;
			const currentAddress = await getWalletAddress();
			const currentChainIdHex = await getChainId();
			const currentChainId = window.web3.utils.hexToNumber(currentChainIdHex);

			const contract = new window.web3.eth.Contract(
				nftJsonInterface.abi,
				nftJsonInterface.networks[currentChainId].address
			);
			const transaction = await contract.methods
				.mint(metaDataUrl)
				.send({ from: currentAddress });

			console.log(transaction);
			await uploadToServer(
				transaction.to,
				parseInt(transaction.events.Transfer.returnValues.tokenId),
				metaDataUrl
			);
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	}

	async function uploadToServer(contractAddress, itemId, metaDataUrl) {
		// 2. Upload data to ipfs
		const { title, description } = formInput;
		if (!title || !description || !file)
			return alert("Please ensure everything is filled.");

		// Get chain details
		const chainId = await getChainId();
		// Get contract details

		var formData = new FormData();
		formData.append("asset", file);
		formData.set("name", title);
		formData.set("description", description);
		formData.set("chainId", chainId);
		formData.set("contract_address", contractAddress);
		formData.set("item_id", itemId);
		formData.set("metadata_url", metaDataUrl);

		await assetHttpService.createAsset(formData);
	}

	async function onFileChange(e) {
		try {
			const file = e.target.files[0];
			if (!file) return;
			setFile(file);
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	}

	const [imageUrl, setImageUrl] = useState();
	useEffect(() => {
		if (file) setImageUrl(URL.createObjectURL(file));
		getChainName();
	}, [file, chainId]);

	return (
		<div className="create-screen-container">
			<div onClick={closeModal} className="create-screen-container-inner">
				{/* Heading */}
				<div className="heading">Create NFT</div>
				<hr />
				{/* Content */}
				<Box
					className="content-container"
					sx={{ flexDirection: { xs: "column", md: "row" } }}
				>
					{/* Image */}
					<div className="image-container">
						<div className="title">
							<p>Upload your images</p>
						</div>
						<div>
							<p>PNG, JPG, and GIF files are allowed</p>
						</div>
						<div
							className="image-dropper"
							style={{
								backgroundImage: `url(${file ? imageUrl : ""})`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "200px",
							}}
							onClick={(e) => (file ? window.open(imageUrl, "_blank") : "")}
						>
							{file ? "" : "Click below button to upload your asset"}
						</div>
						<label htmlFor="file-upload" className="custom-file-upload">
							<div className="image-picker">
								<AiOutlineUpload />
								<p>{file ? "Change File" : "Upload File"}</p>
								<input
									type="file"
									name="Asset"
									className="my-4"
									id="file-upload"
									onChange={onFileChange}
								/>
							</div>
						</label>
					</div>
					{/* Data */}
					<div className="data-container">
						{/* Title */}
						<div className="data-container-field">
							<p>Title</p>
							<input
								type="text"
								placeholder="Enter your NFT title"
								onChange={(e) =>
									updateFormInput({ ...formInput, title: e.target.value })
								}
							/>
						</div>
						{/* Description */}
						<div className="data-container-field">
							<p>Description</p>
							<textarea
								type="text"
								rows="5"
								placeholder="Enter description of the NFT"
								onChange={(e) =>
									updateFormInput({ ...formInput, description: e.target.value })
								}
							/>
						</div>
						{/* Categories
						<div className="data-container-field">
							<p>Categories</p>
							<input
								type="text"
								rows="5"
								placeholder="Type Category"
							/>
						</div> */}
						{/* Categories */}
						{/* <div className="data-container-field">
							<p>Price</p>
							<input
								type="number"
								rows="5"
								placeholder="Set Price"
								onChange={(e) =>
									updateFormInput({ ...formInput, price: e.target.value })
								}
							/>
						</div> */}
						{/* Create Button */}
						<Box className="createscreen-create-button">
							<div
								onClick={() => {
									if (!chainName) return;
									uploadToIpfs();
								}}
							>
								<p style={{ cursor: chainName ? "pointer" : "not-allowed" }}>
									{!loading ? "Create" : "loading..."}
								</p>
							</div>
						</Box>
					</div>
				</Box>
				<hr />
				<Box>
					{chainName ? (
						<Typography variant="h6">
							Your currently on <u>{chainName}</u>, Minting takes place in{" "}
							{chainName}.
						</Typography>
					) : (
						<Typography variant="h6" sx={{ color: "red" }}>
							Unsupported Network, change network in metamask
						</Typography>
					)}
				</Box>
			</div>
		</div>
	);
}
