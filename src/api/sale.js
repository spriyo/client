import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class SaleHttpService {
	token = localStorage.getItem("token");

	async getActiveSales() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/display/activesales`)
		);
		return resolved;
	}

	async createSale(data) {
		const resolved = await resolve(
			axios.post(`${WEB_API_BASE_URL}/sales`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async updateSale(auctionId, data) {
		const resolved = await resolve(
			axios.patch(`${WEB_API_BASE_URL}/sales/update/${auctionId}`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async cancelSale(auctionId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/sales/cancel/${auctionId}`,
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

	async buySale(auctionId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/sales/buy/${auctionId}`,
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
