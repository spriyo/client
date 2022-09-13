import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class AuctionHttpService {
	token = localStorage.getItem("token");

	async createAuction(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/auctions`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async updateReservePrice(auctionId, data) {
		const resolved = await resolve(
			axios.patch(`${WEB_API_BASE_URL}/auctions/update/${auctionId}`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async cancelAuction(auctionId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/auctions/cancel/${auctionId}`,
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

	async settleAuction(auctionId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/auctions/settle/${auctionId}`,
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

	async bidAuction(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/auctions/bid`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async getBids() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/auctions/bids`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}
}
