import axios from "axios";
import { WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class SearchHttpService {
	token = localStorage.getItem("token");

	async searchAssets({
		createdAt = "desc",
		limit = 10,
		skip = 0,
		query = "",
		chainId,
		owner,
	}) {
		const resolved = await resolve(
			axios.get(
				`${WEB_API_BASE_URL}/display/searchnft?createdAt=${createdAt}&limit=${limit}&skip=${skip}&query=${query}&chain_id=${
					chainId ?? ""
				}&owner=${owner ?? ""}`,
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
