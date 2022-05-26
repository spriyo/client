import axios from "axios";

export class PinataHttpService {
	baseURL = "https://api.pinata.cloud/pinning";

	async pinFileToIPFS(file) {
		const formData = new FormData();
		formData.append("file", file);
		return await axios.post(this.baseURL + "/pinFileToIPFS", formData, {
			headers: {
				"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
				Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
			},
		});
	}

	async pinJSONToIPFS(data) {
		const originalData = { ...data };
		let pinataObjectName = data.name.toLowerCase().replace(" ", "_");
		data.pinataMetadata = {
			name: pinataObjectName,
			keyvalues: {
				original_name: data.name,
			},
		};
		data.pinataContent = originalData;
		const jsonObject = JSON.stringify(data);
		return await axios.post(this.baseURL + "/pinJSONToIPFS", jsonObject, {
			headers: {
				"Content-Type": `application/json`,
				Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
			},
		});
	}
}
