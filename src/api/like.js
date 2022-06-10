import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class LikeHttpService {
	token = localStorage.getItem("token");

	async getLikedAssets() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/likes`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
		);
		return resolved;
	}

	async likeAsset(assetId) {
		const resolved = await resolve(
			axios.post(
				`${WEB_API_BASE_URL}/likes/${assetId}/like`,
				{},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}
			)
		);
		return resolved;
	}

	async unLikeAsset(assetId) {
		const resolved = await resolve(
			axios.post(
				`${WEB_API_BASE_URL}/likes/${assetId}/unlike`,
				{},
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
