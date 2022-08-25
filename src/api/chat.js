import axios from "axios";
import { resolve } from "../utils/resolver";

export class ChatHttpService {
	base_url = process.env.REACT_APP_CHAT_SERVER_URL;

	async getActiveUsers() {
		const resolved = await resolve(axios.get(`${this.base_url}/activeusers`));
		return resolved;
	}
}
