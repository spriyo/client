import axios from "axios";
import { BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class IrlHttpService {
	token = localStorage.getItem("token");

	async uploadIrlImage(formData) {
		const resolved = await resolve(
			axios.post(`${BASE_URL}/common/irls/uploadimage`, formData, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}
}
