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

	async getCollections({
		user_address = "",
		query = "",
		skip = 0,
		limit = 10,
	}) {
		const resolved = await resolve(
			axios.get(
				`${V2_WEB_API_BASE_URL}/collections?limit=${limit}&skip=${skip}&query=${query}&user_address=${user_address}`
			)
		);
		return resolved;
	}

	async getContract(address) {
		const resolved = await resolve(
			axios.get(`${V2_WEB_API_BASE_URL}/contracts/${address}`)
		);
		return resolved;
	}

	async getUserContracts() {
		const resolved = await resolve(
			axios.get(`${V2_WEB_API_BASE_URL}/contracts`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}
}
