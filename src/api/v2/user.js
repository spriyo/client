import axios from "axios";
import { V2_WEB_API_BASE_URL } from "../../constants";
import { resolve } from "../../utils/resolver";

export class UserHttpService {
	token = localStorage.getItem("token");

	async getUserNFTs(userAddress) {
		const resolved = await resolve(
			axios.get(`${V2_WEB_API_BASE_URL}/users/nfts/${userAddress}`, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}
}
