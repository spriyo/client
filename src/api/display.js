import axios from "axios";
import { WEB_API_BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class DisplayHttpService {
	async getTopCreators() {
		const resolved = await resolve(
			axios.get(`${WEB_API_BASE_URL}/display/topcreators`)
		);
		return resolved;
	}
}
