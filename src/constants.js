export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const WEB_API_BASE_URL = `${BASE_URL}/website/v1`;
export const V2_WEB_API_BASE_URL = `${BASE_URL}/website/v2`;
export const DOTSHM_ADDRESS = "0x560dde815414953Acc097d9d29c10B46644bce02";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ChainsConfig = {
	SHARDEUM_LIBERTY: {
		chainId: 8080,
		chainName: "Shardeum Liberty",
		nativeCurrency: { name: "Shardeum", symbol: "SHM", decimals: 18 },
		rpcUrls: ["https://liberty10.shardeum.org/"],
		blockExplorerUrls: ["https://explorer.liberty10.shardeum.org/"],
	},
	SHARDEUM_LIBERTY_2: {
		chainId: 8081,
		chainName: "Shardeum Liberty 2.0",
		nativeCurrency: { name: "Shardeum", symbol: "SHM", decimals: 18 },
		rpcUrls: ["https://liberty20.shardeum.org/"],
		blockExplorerUrls: ["https://explorer-liberty20.shardeum.org/"],
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
