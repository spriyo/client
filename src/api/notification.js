import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class NotificationHttpService {
	token = localStorage.getItem("token");

	async getNotificationList() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/notifications`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		);
		return resolved;
	}

	async getNotitficationCount() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/notifications/count`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		);
		return resolved;
	}
}
