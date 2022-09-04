import axios from "axios";
import { BASE_URL } from "../constants";
import { resolve } from "../utils/resolver";

export class AuthHttpService {
	token = localStorage.getItem("token");
	async signIn() {
		// 1. Send Address to server
		// getting address from which we will sign message
		const address = await window.ethereum.selectedAddress;
		console.log("Select address : " + address);
		if (!address) throw new Error("Please connect your wallet to this site!");

		const nonceResponse = await axios.post(
			`${BASE_URL}/common/generateNonce`,
			{ address },
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			}
		);
		const formattedNonceResponse = nonceResponse.data;
		console.log("Nonce from server : " + formattedNonceResponse.nonce);
		const nonce = formattedNonceResponse.nonce;

		// 2. Generate personal sign using the Address and NONCE recieved from 1.
		const sign = await window.ethereum.request({
			method: "personal_sign",
			params: [address, "Please approve this message \n \nNonce:\n" + nonce],
		});
		console.log("Sign : " + sign);

		const signinResponse = await fetch(`${BASE_URL}/website/v1/user/signin`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				displayName: "Unnamed",
				sign,
				nonce,
			}),
		});
		const formattedSigninResponse = await signinResponse.json();
		console.log(formattedSigninResponse);
		localStorage.setItem("token", formattedSigninResponse.token);
		localStorage.setItem("user", JSON.stringify(formattedSigninResponse.user));
		return formattedSigninResponse;
	}

	async getUser() {
		// 3. Send the token whenever auth is required.
		const token = localStorage.getItem("token");
		const resolved = await resolve(
			axios.get(`${BASE_URL}/website/v1/user`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		);
		console.log(resolved);
		if (resolved.statusCode === 200) {
			localStorage.setItem("user", JSON.stringify(resolved.data));
		} else {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		}
		return resolved;
	}

	async signOut() {
		try {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		} catch (error) {
			console.log(error);
		}
	}

	async updateProfile(data) {
		const resolved = await resolve(
			axios.patch(`${BASE_URL}/website/v1/user`, data, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
				},
			})
		);
		return resolved;
	}

	async updateAvatar(formData) {
		const resolved = await resolve(
			axios.patch(`${BASE_URL}/website/v1/user/avatar`, formData, {
				headers: {
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "multipart/form-data",
				},
			})
		);
		return resolved;
	}

	async getUserById(id) {
		const resolved = await resolve(
			axios.get(`${BASE_URL}/website/v1/user/${id}`, {})
		);
		return resolved;
	}

	async updateFollowUser(id) {
		const resolved = await resolve(
			axios.post(
				`${BASE_URL}/website/v1/follow/${id}`,
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
