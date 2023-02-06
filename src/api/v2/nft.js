import axios from "axios";
import { WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class NFTHttpService {
	token = localStorage.getItem("token");

	async createNFT(formData) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/nfts`, formData, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}

	async transferAsset(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/nfts/transfer`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async createEvent(trxHash) {
		const resolved = await resolve(
			axios.get(`https://indexer.spriyo.xyz/api/createEvents/${trxHash}`)
		);
		return resolved;
	}

	async getAssetById(contract_address, token_id) {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/nfts/${contract_address}/${token_id}`)
		);
		return resolved;
	}

	async getTotalNFTCount() {
		const resolved = await resolve(axios.get(`${WEB_API_BASE_URL}/nfts/count`));
		return resolved;
	}
}
