import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class AssetHttpService {
	async createAsset(formData) {
		const token = localStorage.getItem("token");
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/assets`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		console.log(resolved);
	}
}
