import axios from "axios";
import { V2_WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class UserHttpService {
	token = localStorage.getItem("token");

	async getUserNFTs(userAddress, { limit = 10, skip = 0 }) {
		const resolved = await resolve(
			axios.get(
				`${V2_WEB_API_BASE_URL}/users/nfts/${userAddress}?&limit=${limit}&skip=${skip}`,
				{
					headers: {
						Authorization: `Bearer ${this.token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			)
		);
		return resolved;
	}
}
