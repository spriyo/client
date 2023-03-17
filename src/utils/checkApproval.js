import { getWalletAddress } from "./wallet";
import ERC721Interface from "../contracts/ERC721.json";
import ERC1155Interface from "../contracts/ERC1155.json";
import { toast } from "react-toastify";
import { ERC1155Contract, ERC721Contract } from "../constants";

export async function checkApproval(approval_address, nft) {
	let isApproved = false;
	try {
		const currentAddress = await getWalletAddress();
		const abi = nft.type === "721" ? ERC721Interface.abi : ERC1155Interface.abi;
		const Contract =
			nft.type === "721"
				? ERC721Contract(nft.contract_address)
				: ERC1155Contract(nft.contract_address);

		const contract = new window.web3.eth.Contract(abi, nft.contract_address);
		let isApprovedForAll;
		// Check for approval
		isApprovedForAll = await Contract.methods
			.isApprovedForAll(currentAddress, approval_address)
			.call();

		if (!isApprovedForAll) {
			const isConfirmed = window.confirm(
				"Before selling the NFT on Spriyo, please approve us as a operator for your NFT."
			);
			if (isConfirmed) {
				await contract.methods
					.setApprovalForAll(approval_address, true)
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
