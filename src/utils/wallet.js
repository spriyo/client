import Web3 from "web3";

export async function connectWalletToSite() {
	try {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
			return true;
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
			return true;
		} else {
			window.alert(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
			return false;
		}
	} catch (e) {
		if (e.code === 4001) {
			alert(e.message);
		}
		return false;
	}
}

export async function switchChain(config) {
	let chainId = config.chainId;

	try {
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: chainId }],
		});
	} catch (error) {
		if (error.code === 4902) {
			try {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [config],
				});
			} catch (addError) {
				console.error(addError);
			}
		}
	}
}

export async function getWalletAddress() {
	try {
		let address = await window.ethereum.selectedAddress;
		return address;
	} catch (error) {
		console.log(error);
	}
}

export async function getChainId() {
	try {
		let chainId;
		if (process.env.REACT_APP_ENV === "development") {
			chainId = await window.ethereum.chainId;
		} else {
			chainId = process.env.REACT_APP_CHAIN_ID;
		}
		return chainId;
	} catch (error) {
		console.log(error);
	}
}
