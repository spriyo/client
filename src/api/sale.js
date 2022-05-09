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
}
