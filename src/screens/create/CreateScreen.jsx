import "./CreateScreen.css";
import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export function CreateScreen({ closeModal }) {
	const [file, setFile] = useState(null);
	const [fileUrl, setFileUrl] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [formInput, updateFormInput] = useState({
		price: 0,
		name: "",
		description: "",
	});

	async function uploadToIpfs(e) {
		try {
			// 1. Upload file to ipfs
			if (!file) return;
			setFileUrl(URL.createObjectURL(file));
			const ipfsFile = await client.add(file, {
				progress: (prog) => setUploadProgress(prog),
			});
			console.log(ipfsFile);
			const assetUrl = `https://ipfs.infura.io/ipfs/${ipfsFile.path}`;

			// 2. Upload data to ipfs
			const { name, description, price } = formInput;
			if (!name || !description || !price || !assetUrl)
				return alert("Please ensure everything is filled.");
			const data = JSON.stringify({
				name,
				description,
				assetPath: assetUrl,
			});
			const jsonIpfs = await client.add(data);
			console.log(jsonIpfs);
			const url = `https://ipfs.infura.io/ipfs/${jsonIpfs.path}`;
			console.log(url);

			// 3. After file is uploaded to IPFS, pass the URL to save it on Polygon
			createSale(url);
		} catch (error) {
			console.log(error);
		}
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

	async function createSale(url) {
		// const contract = window.web3.eth.Contract(
		// 	jsonInterface.abi,
		// 	contractAddress
		// );
	}

	// async function createSale(url) {
	// 	const web3Modal = new Web3Modal();
	// 	const connection = await web3Modal.connect();
	// 	const provider = new ethers.providers.Web3Provider(connection);
	// 	const signer = provider.getSigner();
	// 	/* next, create the item */
	// 	let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
	// 	let transaction = await contract.createToken(url);
	// 	let tx = await transaction.wait();
	// 	let event = tx.events[0];
	// 	let value = event.args[2];
	// 	let tokenId = value.toNumber();
	// 	const price = ethers.utils.parseUnits(formInput.price, "ether");
	// 	/* then list the item for sale on the marketplace */
	// 	contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
	// 	let listingPrice = await contract.getListingPrice();
	// 	listingPrice = listingPrice.toString();
	// 	transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
	// 		value: listingPrice,
	// 	});
	// 	await transaction.wait();
	// 	router.push("/");
	// }

	return (
		<div className="create-screen-container">
			<div onClick={closeModal} className="create-screen-container-inner">
				{/* Heading */}
				<div className="heading">Create NFT</div>
				<hr />
				{/* Content */}
				<div className="content-container">
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
								backgroundImage: `url(${
									file ? URL.createObjectURL(file) : ""
								})`,
								backgroundPosition: "center",
								backgroundSize: "cover",
								backgroundRepeat: "no-repeat",
								height: "200px",
							}}
							onClick={(e) =>
								file ? window.open(URL.createObjectURL(file), "_blank") : ""
							}
						>
							{file ? "" : "Drag and Drop or Browse to choose a file"}
						</div>
						<label for="file-upload" class="custom-file-upload">
							<div className="image-picker">
								<AiOutlineUpload />
								<p>Upload File</p>
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
								onclick="event.stopPropagation();"
								placeholder="Enter your NFT title"
								onChange={(e) =>
									updateFormInput({ ...formInput, name: e.target.value })
								}
							/>
						</div>
						{/* Description */}
						<div className="data-container-field">
							<p>Description</p>
							<textarea
								type="text"
								rows="5"
								onclick="event.stopPropagation();"
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
								onclick="event.stopPropagation();"
								placeholder="Type Category"
							/>
						</div> */}
						{/* Categories */}
						<div className="data-container-field">
							<p>Price</p>
							<input
								type="text"
								rows="5"
								onclick="event.stopPropagation();"
								placeholder="Set Price"
								onChange={(e) =>
									updateFormInput({ ...formInput, price: e.target.value })
								}
							/>
						</div>
						{/* Create Button */}
						<div className="createscreen-create-button">
							<div onClick={uploadToIpfs}>
								<p>Create</p>
							</div>
						</div>
					</div>
				</div>
				<hr />
			</div>
		</div>
	);
}
