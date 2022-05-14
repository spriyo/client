import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class OfferHttpService {
	token = localStorage.getItem("token");

	async createOffer(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/offers`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async cancelOffer(offerId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/offers/cancel/${offerId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
						"Content-Type": "application/json",
					},
				}
			)
		);
		return resolved;
	}

	async acceptOffer(offerId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/offers/accept/${offerId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
						"Content-Type": "application/json",
					},
				}
			)
		);
		return resolved;
	}
}
