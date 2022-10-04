import axios from "axios";
import { V2_WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class DropHttpService {
	token = localStorage.getItem("token");

	async createDrop(formData) {
		const resolved = await resolve(
			axios.post(`${V2_WEB_API_BASE_URL}/drops`, formData, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}

	async getDropByCollectionId(collection_id) {
		const resolved = await resolve(
			axios.get(`${V2_WEB_API_BASE_URL}/drops/${collection_id}`)
		);
		return resolved;
	}
}
