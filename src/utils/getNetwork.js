import { ChainsConfig } from "../constants";

export const getNetworkByChainId = async function (chainId) {
	let chain;
	for (const c in ChainsConfig) {
		if (chainId === ChainsConfig[c].chainId) {
			chain = ChainsConfig[c];
		}
	}
	return chain ? chain : false;
};
