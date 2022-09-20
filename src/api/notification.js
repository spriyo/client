import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class NotificationHttpService {
	token = localStorage.getItem("token");

	async getNotitficationList() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/notification`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		);
		return resolved;
	}

	async updateNotitfication(id, payload) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/notification/update-notification/${id}`,
				payload,
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
		);
		return resolved;
	}
}
