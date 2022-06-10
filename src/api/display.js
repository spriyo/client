import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class DisplayHttpService {
	token = localStorage.getItem("token");
	async getTopCreators() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/display/topcreators`)
		);
		return resolved;
	}

	async searchAssets({
		createdAt = "desc",
		limit = 10,
		skip = 0,
		query = "",
		chainId,
	}) {
		const resolved = await resolve(
			axios.get(
				`${WEB_API_BASE_URL}/display/search?createdAt=${createdAt}&limit=${limit}&skip=${skip}&query=${query}&chainId=${
					chainId ?? ""
				}`,
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
