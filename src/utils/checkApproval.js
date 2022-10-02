import { getWalletAddress } from "./wallet";
import NFTContractJSON from "../contracts/Spriyo.json";
import { toast } from "react-toastify";

export async function checkApproval(
	approval_address,
	contract_address,
	token_id
) {
	let isApproved = false;
	try {
		const currentAddress = await getWalletAddress();

		const NFTContract = new window.web3.eth.Contract(
			NFTContractJSON.abi,
			contract_address
		);

		// Check for approval
		const approveAddress = await NFTContract.methods
			.getApproved(token_id)
			.call();

		if (approval_address !== approveAddress) {
			const isConfirmed = window.confirm(
				"Before selling the NFT on Spriyo, please approve us as a operator for your NFT."
			);
			if (isConfirmed) {
				await NFTContract.methods
					.approve(approval_address, token_id)
					.send({ from: currentAddress });
				isApproved = true;
			}
		} else {
			isApproved = true;
		}
	} catch (error) {
		toast(error.message);
	}
	return isApproved;
}
