import axios from "axios";
import { V2_WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class CollectionHttpService {
	token = localStorage.getItem("token");

	async createCollection(formData) {
		const resolved = await resolve(
			axios.post(`${V2_WEB_API_BASE_URL}/collections`, formData, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}

	async getCollection(collectionUsername) {
		const resolved = await resolve(
			axios.get(`${V2_WEB_API_BASE_URL}/collections/${collectionUsername}`)
		);
		return resolved;
	}
}
