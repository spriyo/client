import "./CreateScreen.css";

import { React, useEffect, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { AssetHttpService } from "../../api/asset";
import { getWalletAddress } from "../../utils/wallet";
import { PinataHttpService } from "../../api/pinata";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ChangeNetworkComponent } from "../../components/ChangeNetworkComponent";
import { switchChain } from "../../state/actions/wallet";
import { useDispatch } from "react-redux";
import { switchChain as changeChain } from "../../utils/wallet";
import { useRef } from "react";
import { ButtonComponent } from "../../components/ButtonComponent";

export function CreateScreen({ closeModal }) {
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const assetHttpService = new AssetHttpService();
	const pinataHttpService = new PinataHttpService();
	const [formInput, updateFormInput] = useState({
		title: "",
		description: "",
	});
	const nftContract = useSelector((state) => state.contractReducer.nftContract);
	const dispatch = useDispatch();
	const currentChainIdRef = useRef();
	const stateChainId = useSelector((state) => state.walletReducer.chainId);

	async function uploadToIpfs() {
		if (loading) return;
		try {
			const { title, description } = formInput;
			if (!title || !description || !file)
				return alert("Please ensure everything is filled.");
			setLoading(true);

			// 1. Upload file to ipfs
			const assetUrl = await pinataHttpService.pinFileToIPFS(file);

			// 2. Upload data to ipfs
			const metaDataUrl = await pinataHttpService.pinJSONToIPFS(
				formInput,
				assetUrl
			);

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

			const transaction = await nftContract.methods
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
		const chainId = currentChainIdRef.current;
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

	function checkFileType(filename) {
		// Ad obj for 3D file upload
		if (!filename.match(/\.(jpg|jpeg|png|mp4)$/)) {
			alert("Please upload only image or video file.");
			return false;
		} else {
			return true;
		}
	}

	async function onFileChange(e) {
		try {
			const f = e.target.files[0];
			if (!f) return;
			const validFile = checkFileType(f.name);
			if (!validFile) return;
			setFile(f);
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	}

	async function onNetworkChange(network) {
		await changeChain(network);
		dispatch(switchChain(network.chainId));
		currentChainIdRef.current = network.chainId;
	}

	function dragOverHandler(ev) {
		ev.preventDefault();
	}

	function dropHandler(ev) {
		ev.preventDefault();
		// Limit 1 File
		if (ev.dataTransfer.items.length > 1 || ev.dataTransfer.files > 1) {
			return alert("Please upload one file");
		}

		if (ev.dataTransfer.items) {
			for (let i = 0; i < ev.dataTransfer.items.length; i++) {
				if (ev.dataTransfer.items[i].kind === "file") {
					const f = ev.dataTransfer.items[i].getAsFile();
					const validFile = checkFileType(f.name);
					if (!validFile) return;
					console.log(f);
					setFile(f);
				}
			}
		} else {
			for (let i = 0; i < ev.dataTransfer.files.length; i++) {
				const validFile = checkFileType(ev.dataTransfer.files[i].name);
				if (!validFile) return;
				setFile(ev.dataTransfer.files[i]);
			}
		}
	}

	const [imageUrl, setImageUrl] = useState();
	useEffect(() => {
		if (file) setImageUrl(URL.createObjectURL(file));
		currentChainIdRef.current = stateChainId;
	}, [file, stateChainId]);

	return (
		<div className="create-screen-container">
			<div onClick={closeModal} className="create-screen-container-inner">
				{/* Heading */}
				<Box display={"flex"} justifyContent="space-between">
					<div className="heading">Create NFT</div>
					<ChangeNetworkComponent onNetworkChange={onNetworkChange} />
				</Box>
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
							<p>PNG, JPG, and MP4 files are allowed</p>
						</div>
						<div
							className="image-dropper"
							style={{
								backgroundImage: file
									? file.type === "video/mp4"
										? "none"
										: `url(${file ? imageUrl : ""})`
									: "none",
								backgroundPosition: "center",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "200px",
								textAlign: "center",
							}}
							onClick={(e) => (file ? window.open(imageUrl, "_blank") : "")}
							onDrop={(e) => dropHandler(e)}
							onDragOver={(e) => dragOverHandler(e)}
						>
							{file ? (
								file.type === "video/mp4" ? (
									<video
										src={URL.createObjectURL(
											new Blob([file], { type: "video/mp4" })
										)}
										autoPlay
										height={"200px"}
										width={"280px"}
										muted
										loop
									></video>
								) : (
									""
								)
							) : (
								"Drag & drop or click below button to upload your asset"
							)}
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
							<ButtonComponent
								text={!loading ? "Create" : "loading..."}
								onClick={uploadToIpfs}
							/>
						</Box>
					</div>
				</Box>
				<hr />
			</div>
		</div>
	);
}
