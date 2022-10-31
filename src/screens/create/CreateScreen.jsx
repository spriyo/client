import "./CreateScreen.css";

import { React, useEffect, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { getWalletAddress } from "../../utils/wallet";
import { NftStorageHttpService } from "../../api/nftStorage";
import { useNavigate } from "react-router-dom";
import {
	Box,
	FormControl,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { ChangeNetworkComponent } from "../../components/ChangeNetworkComponent";
import { switchChain } from "../../state/actions/wallet";
import { useDispatch } from "react-redux";
import { switchChain as changeChain } from "../../utils/wallet";
import { useRef } from "react";
import { ButtonComponent } from "../../components/ButtonComponent";
import { NFTHttpService } from "../../api/v2/nft";
import nftJsonInterface from "../../contracts/Spriyo.json";
import { CgAddR } from "react-icons/cg";
import { toast } from "react-toastify";
import { CollectionHttpService } from "../../api/v2/collection";
import SpriyoLetterLogo from "../../assets/spriyo-letter-logo.png";

export function CreateScreen({ closeModal }) {
	const navigate = useNavigate();
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const nftHttpService = new NFTHttpService();
	const nftStorageHttpService = new NftStorageHttpService();
	const [formInput, updateFormInput] = useState({
		title: "",
		description: "",
	});
	const dispatch = useDispatch();
	const currentChainIdRef = useRef();
	const stateChainId = useSelector((state) => state.walletReducer.chainId);
	const user = useSelector((state) => state.authReducer.user);
	const collectionHttpService = new CollectionHttpService();
	const spriyoNFTAddress = "0xdd4c71b099b68a8a18c8e629c6acda9bd495abe2";
	const [collectionSelectValue, setCollectionSelectValue] =
		useState(spriyoNFTAddress);
	const [collections, setCollections] = useState([]);

	async function uploadToIpfs() {
		if (loading) return;
		try {
			const { title, description } = formInput;
			if (!title || !description || !file)
				return alert("Please ensure everything is filled.");
			setLoading(true);

			// 1. Upload file to ipfs
			const assetUrl = await nftStorageHttpService.pinFileToIPFS(file);

			// 2. Upload data to ipfs
			const metaDataUrl = await nftStorageHttpService.pinJSONToIPFS(
				formInput,
				assetUrl
			);

			// 3. After file is uploaded to IPFS, pass the URL to mint it on chain
			const resolved = await mintAsset(metaDataUrl, {
				name: title,
				description,
				image: assetUrl,
			});
			setLoading(false);

			// Redirect to home page
			if (!resolved.error) {
				navigate("/", { replace: true });
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}

	async function mintAsset(metaDataUrl, metadata) {
		try {
			if (!metaDataUrl) return;
			const currentAddress = await getWalletAddress();
			const nftContract = new window.web3.eth.Contract(
				nftJsonInterface.abi,
				collectionSelectValue
			);

			const transaction = await nftContract.methods
				.mint(metaDataUrl)
				.send({ from: currentAddress });

			const resolved = await uploadToServer(
				transaction.to,
				parseInt(transaction.events.Transfer.returnValues.tokenId),
				metaDataUrl,
				transaction.events.Transfer.returnValues.to,
				metadata
			);
			return resolved;
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	}

	async function uploadToServer(
		contractAddress,
		itemId,
		metaDataUrl,
		owner,
		metadata
	) {
		try {
			const { title, description } = formInput;
			if (!title || !description || !file)
				return alert("Please ensure everything is filled.");

			// Get chain details
			const chainId = currentChainIdRef.current;

			var formData = new FormData();
			formData.append("asset", file);
			formData.set("name", title);
			formData.set("description", description);
			formData.set("chain_id", chainId);
			formData.set("contract_address", contractAddress);
			formData.set("metadata_url", metaDataUrl);
			formData.set("token_id", itemId);
			formData.set("type", "721");
			formData.set("owner", owner);
			formData.set("name", title);
			formData.set("value", "1");
			for (let previewKey in metadata) {
				formData.append(`metadata[${previewKey}]`, metadata[previewKey]);
			}

			const resolved = await nftHttpService.createNFT(formData);
			return resolved;
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	}

	async function getCollections() {
		try {
			const resolved = await collectionHttpService.getCollections({user_address:user.address});
			if (!resolved.error) {
				setCollections(resolved.data);
			}
		} catch (error) {
			toast(error.message);
		}
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

	const handleChange = async (event) => {
		setCollectionSelectValue(event.target.value);
	};

	const [imageUrl, setImageUrl] = useState();
	useEffect(() => {
		// Remove this
		alert("Under Maintaince");
		navigate("/");
		if (file) setImageUrl(URL.createObjectURL(file));
		if (user) getCollections();
		currentChainIdRef.current = stateChainId;
	}, [file, stateChainId, user]);

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
					alignItems="center"
				>
					{/* Image */}
					<div className="image-container">
						<div className="title">
							<p>Upload your images</p>
						</div>
						<div>
							<p>PNG, JPG, and MP4 files are allowed</p>
						</div>
						<label htmlFor="file-upload">
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
									"Drag & drop"
								)}
							</div>
							<div className="image-picker">
								<div>
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
						{/* Collection */}
						<div className="data-container-field">
							<p>Collection</p>
							<FormControl sx={{ minWidth: 120 }} size="small">
								<Select
									labelId="demo-select-small"
									id="demo-select-small"
									value={collectionSelectValue}
									onChange={handleChange}
								>
									<MenuItem value={spriyoNFTAddress}>
										<Box display={"flex"}>
											<img
												height="25px"
												src={SpriyoLetterLogo}
												alt="Spriyo Logo"
											/>
											<Box pl={1}>Spriyo Original</Box>
										</Box>
									</MenuItem>
									<Box m={1}>
										<Typography variant="h5">Your Collections</Typography>
									</Box>
									{collections.map((c, i) => {
										return (
											<MenuItem value={c.contract_address} key={i}>
												<Box display={"flex"}>
													<img
														height="25px"
														src={c.image}
														alt="Foundation Logo"
													/>
													<Box pl={1}>{c.name}</Box>
												</Box>
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						</div>
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
