import axios from "axios";

export class PinataHttpService {
	baseURL = "https://api.pinata.cloud/pinning";

	async pinFileToIPFS(file) {
		try {
			if (!file) return;
			const formData = new FormData();
			formData.append("file", file);
			const ipfsFile = await axios.post(
				this.baseURL + "/pinFileToIPFS",
				formData,
				{
					headers: {
						"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
						Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
					},
				}
			);
			const assetUrl = `${process.env.REACT_APP_IPFS_BASE_URL}/${ipfsFile.data.IpfsHash}`;
			return assetUrl;
		} catch (error) {
			console.log(error);
		}
	}

	async pinJSONToIPFS(formInput, assetUrl) {
		try {
			let data = {};
			const { title, description } = formInput;
			const content = {
				name: title,
				description,
				image: assetUrl,
			};
			let pinataObjectName = content.name.toLowerCase().replace(" ", "_");
			data.pinataMetadata = {
				name: pinataObjectName,
				keyvalues: {
					original_name: content.name,
				},
			};
			data.pinataContent = content;
			const jsonIpfs = await axios.post(this.baseURL + "/pinJSONToIPFS", data, {
				headers: {
					"Content-Type": `application/json`,
					Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
				},
			});
			const url = `${process.env.REACT_APP_IPFS_BASE_URL}/${jsonIpfs.data.IpfsHash}`;

			return url;
		} catch (error) {
			console.log(error);
		}
	}
}
