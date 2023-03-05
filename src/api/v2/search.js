import axios from "axios";
import { WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class SearchHttpService {
	token = localStorage.getItem("token");

	async searchAssets({
		byStatus,
		createdAt = "desc",
		limit = 10,
		skip = 0,
		query = "",
		chainId = "",
		owner = "",
		contract = "",
		type = "",
		status = "",
	}) {
		const resolved = await resolve(
			axios.get(
				`${WEB_API_BASE_URL}/display/${
					byStatus ? "searchnftbystatus" : "searchnft"
				}?status=${status}&createdAt=${createdAt}&limit=${limit}&skip=${skip}&query=${query}&chain_id=${chainId}&owner=${owner}&contract=${contract}&type=${type}`,
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
