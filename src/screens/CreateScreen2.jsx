import { Button, Box } from "@mui/material";
import React from "react";

export const CreateScreen2 = () => {
	// Types
	const domain = [
		{ name: "name", type: "string" },
		{ name: "version", type: "string" },
		{ name: "chainId", type: "uint256" },
		{ name: "verifyingContract", type: "address" },
	];

	const voucher = [{ name: "name", type: "string" }];

	const domainData = {
		name: "Spriyo NFT",
		version: "1",
		chainId: "1",
		verifyingContract: "0x3328358128832A260C76A4141e19E2A943CD4B6D",
	};
	var message = {
		name: "leo",
	};

	const data = JSON.stringify({
		types: {
			EIP712Domain: domain,
			NFTVoucher: voucher,
		},
		domain: domainData,
		primaryType: "NFTVoucher",
		message: message,
	});

	async function signTransaction() {
		const signer = window.ethereum.selectedAddress;
		window.web3.currentProvider.sendAsync(
			{
				method: "eth_signTypedData_v3",
				params: [signer, data],
				from: signer,
			},
			function (err, result) {
				if (err) {
					return console.error(err);
				}
				const signature = result.result.substring(2);
				const r = "0x" + signature.substring(0, 64);
				const s = "0x" + signature.substring(64, 128);
				const v = parseInt(signature.substring(128, 130), 16);
				// The signature is now comprised of r, s, and v.
				console.log(r, s, v, signature);
			}
		);
	}

	return (
		<Box>
			<Button onClick={signTransaction} variant="contain">
				Click me
			</Button>
		</Box>
	);
};
