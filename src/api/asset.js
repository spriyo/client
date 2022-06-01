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

	async importAsset(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/assets/import`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async getRecentlyAdded({ chainId }) {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/assets?chainId=${chainId ?? ""}`)
		);
		return resolved;
	}

	async getUserAssets(userid) {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/assets/user/` + userid)
		);
		return resolved;
	}

	async getAssetById(assetId) {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/assets/` + assetId)
		);
		return resolved;
	}
}
