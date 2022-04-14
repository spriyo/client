import axios from "axios";

export class AuthHttpService {
	async signIn() {
		// 1. Send Address to server
		// getting address from which we will sign message
		const address = await window.ethereum.selectedAddress;
		console.log("Select address : " + address);
		const nonceResponse = await axios.post(
			"http://192.168.18.41:3000/common/generateNonce",
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

		const signinResponse = await fetch(
			"http://192.168.18.41:3000/website/v1/user/signin",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					displayName: "Unnamed",
					sign,
					nonce,
				}),
			}
		);
		const formattedSigninResponse = await signinResponse.json();
		console.log(formattedSigninResponse);
		localStorage.setItem("token", formattedSigninResponse.token);
	}

	async getUser() {
		// 3. Send the token whenever auth is required.
		const token = localStorage.getItem("token");
		const loginResponse = await axios.get("/website/v1/user", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		console.log(loginResponse.data);
	}
}
