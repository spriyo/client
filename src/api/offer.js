import axios from "axios";
import { V2_WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class OfferHttpService {
	token = localStorage.getItem("token");

	async getOffers(nft_id) {
		const resolved = await resolve(
			axios.get(`${V2_WEB_API_BASE_URL}/offers/${nft_id}`, {
				headers: {
					"Content-Type": "application/json",
				},
			})
		)
		return resolved;
	}
}
