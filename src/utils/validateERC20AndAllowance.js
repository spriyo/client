import { toast } from "react-toastify";
import { ERC20Contract } from "../constants";
import { getWalletAddress } from "./wallet";
import ERC20Interface from "../contracts/ERC20.json";

export async function validateERC20AndAllowance(
	curreny,
	quantity,
	allowanceAddress
) {
	try {
		const currentAddress = await getWalletAddress();
		const ERC20 = ERC20Contract(curreny);
		const balanceOf = await ERC20.methods.balanceOf(currentAddress).call();
		if (balanceOf < quantity) {
			throw new Error("Insufficient ERC20 balance.");
		}
		const allowance = await ERC20.methods
			.allowance(currentAddress, allowanceAddress)
			.call();
		if (allowance < quantity) {
			toast("Aprove us to handle your ERC20 currency.", { type: "info" });
			const erc20Contract = new window.web3.eth.Contract(
				ERC20Interface.abi,
				curreny
			);
			await erc20Contract.methods
				.approve(allowanceAddress, quantity)
				.send({ from: currentAddress });
		}
	} catch (error) {
		throw new Error(error.message);
	}
}
