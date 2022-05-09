import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class AssetHttpService {
	token = localStorage.getItem("token");
	async createAsset(formData) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/assets`, formData, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		console.log(resolved);
	}

	async getRecentlyAdded() {
		const resolved = await resolve(axios.get(`${WEB_API_BASE_URL}/assets`));
		return resolved;
	}
}