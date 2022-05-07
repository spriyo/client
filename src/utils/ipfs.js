import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export async function uploadFileToIpfs(file) {
	try {
		if (!file) return;
		const ipfsFile = await client.add(file);
		console.log(ipfsFile);
		const assetUrl = `${process.env.REACT_APP_IPFS_BASE_URL}/${ipfsFile.path}`;
		return assetUrl;
	} catch (error) {
		console.log(error);
	}
}

export async function uploadJsonToIpfs(formInput, assetUrl) {
	try {
		const { title, description } = formInput;
		const data = JSON.stringify({
			name: title,
			description,
			image: assetUrl,
		});
		const jsonIpfs = await client.add(data);
		console.log(jsonIpfs);
		const url = `${process.env.REACT_APP_IPFS_BASE_URL}/${jsonIpfs.path}`;
		console.log(url);

		return url;
	} catch (error) {
		console.log(error);
	}
}
