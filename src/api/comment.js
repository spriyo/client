import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class CommentHttpService {
	token = localStorage.getItem("token");

	async writeComment(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/comments`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async getComments(nftid) {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/comments/${nftid}?limit=100`)
		);
		return resolved;
	}

	async deleteComment(commentId) {
		const resolved = await resolve(
			axios.delete(`${WEB_API_BASE_URL}/comments/${commentId}`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		);
		return resolved;
	}
}
