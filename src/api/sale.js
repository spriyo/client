import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class SaleHttpService {
	token = localStorage.getItem("token");

	async getActiveSales({ chainId }) {
		const resolved = await resolve(
			axios.get(
				`${WEB_API_BASE_URL}/display/activesales?chainId=${chainId ?? ""}`
			)
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

	async updateSale(saleId, data) {
		const resolved = await resolve(
			axios.patch(`${WEB_API_BASE_URL}/sales/update/${saleId}`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async cancelSale(saleId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/sales/cancel/${saleId}`,
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

	async buySale(saleId) {
		const resolved = await resolve(
			axios.patch(
				`${WEB_API_BASE_URL}/sales/buy/${saleId}`,
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
