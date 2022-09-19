import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";

export class NotificationHttpService {
	token = localStorage.getItem("token");

	async getNotitficationList() {
		const {data: {data}} = await 
			axios.get(`${WEB_API_BASE_URL}/notification`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		return data;
	}

    async updateNotitfication(id, payload) {
		const {data: {data}} = await 
			axios.patch(`${WEB_API_BASE_URL}/notification/update-notification/${id}`, payload, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		return data;
	}

}
