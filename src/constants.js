export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const WEB_API_BASE_URL = `${BASE_URL}/website/v1`;
export const V2_WEB_API_BASE_URL = `${BASE_URL}/website/v2`;

export const ChainsConfig = {
	BINANCE_SMART_CHAIN: {
		chainId: 56,
		chainName: "BNB Smart Chain",
		nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
		rpcUrls: ["https://bsc-dataseed1.binance.org/"],
		blockExplorerUrls: ["https://bscscan.com/"],
	},
	BINANCE_TESTNET: {
		chainId: 97,
		chainName: "BNB Smart Chain Testnet",
		nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
		rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
		blockExplorerUrls: ["https://testnet.bscscan.com/"],
	},
	SHARDEUM_LIBERTY: {
		chainId: 8080,
		chainName: "Shardeum Liberty",
		nativeCurrency: { name: "Shardeum", symbol: "SHM", decimals: 18 },
		rpcUrls: ["https://liberty10.shardeum.org/"],
		blockExplorerUrls: ["https://explorer.liberty10.shardeum.org/"],
	},
	POLYGON_TESTNET: {
		chainId: 80001,
		rpcUrl: "https://matic-mumbai.chainstacklabs.com",
		chainName: "Polygon Testnet",
		nativeCurrency: {
			name: "tMATIC",
			symbol: "tMATIC",
			decimals: 18,
		},
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	},
};
