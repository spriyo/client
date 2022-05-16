import Web3Utils from "web3-utils";

export const ChainsConfig = {
	POLYGON_TESTNET: {
		chainId: Web3Utils.toHex("80001"),
		rpcUrl: "https://matic-mumbai.chainstacklabs.com",
		chainName: "Polygon Testnet",
		nativeCurrency: {
			name: "tMATIC",
			symbol: "tMATIC", // 2-6 characters long
			decimals: 18,
		},
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	},
	POLYGON_MAINNET: {
		chainId: Web3Utils.toHex("137"), // 137
		chainName: "Matic(Polygon) Mainnet",
		nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
		rpcUrls: ["https://polygon-rpc.com"],
		blockExplorerUrls: ["https://www.polygonscan.com/"],
	},
	BINANCE_TESTNET: {
		chainId: Web3Utils.toHex("97"), // 137
		chainName: "BNB Smart Chain Testnet",
		nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
		rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
		blockExplorerUrls: ["https://testnet.bscscan.com/"],
	},
};

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const WEB_API_BASE_URL = `${BASE_URL}/website/v1`;
