import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class NFTHttpService {
	token = localStorage.getItem("token");
	async createNFT1155(formData) {
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
}
