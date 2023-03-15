export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const WEB_API_BASE_URL = `${BASE_URL}/website/v1`;
export const V2_WEB_API_BASE_URL = `${BASE_URL}/website/v2`;
export const DOTSHM_ADDRESS = "0x560dde815414953Acc097d9d29c10B46644bce02";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ERC721_TRANSFER_EVENT_HASH =
	"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
export const ERC1155_TRANSFER_EVENT_HASH =
	"0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62";
export const ERC1155_BATCH_TRANSFER_EVENT_HASH =
	"0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb";
export const SALE_EVENT_HASH =
	"0x0cd43fd9c12c0b040dc330b451adcefd47851dfa029dec57f23f570054ef4688";
export const OFFER_EVENT_HASH =
	"0x3d44ddf83a852335fb93dea137ad2410905452f00c66ea62151f153d0a11ae5e";
export const AUCTION_EVENT_HASH =
	"0x88e98201e0ee31d381fbbafcc13f7a5a0a8e8203bf21a2eb739fa2388ac87207";
export const BID_EVENT_HASH =
	"0x7d827aee9861babd4633b901c0e9619a8bf942083be2e2297aaf3dd5e8f7952b";

export const ChainsConfig = {
	GANACHE: {
		chainId: 8545,
		chainName: "Ganache",
		nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
		rpcUrls: ["http://127.0.0.1:8545"],
		nftContract: "0x4f65017f74311ab393a9772ddfb459c0dbdd44bb",
		nft1155Contract: "0x4f65017f74311ab393a9772ddfb459c0dbdd44bb",
		marketContract: "0x30DE0FB5Cc4C42C4B051b29839f676B89B33d6F8",
		auctionContract: "0x80113527eC332C0369582dF83E26E975B7b58988",
	},
	SHARDEUM_BETA: {
		chainId: 8082,
		chainName: "Shardeum Liberty 2.0",
		nativeCurrency: { name: "Shardeum", symbol: "SHM", decimals: 18 },
		rpcUrls: ["https://sphinx.shardeum.org"],
		blockExplorerUrls: ["https://explorer-sphinx.shardeum.org/"],
		nftContract: "0x5F362d4Ed224aE949Eac7015fA3E8091B89b95e8",
		nft1155Contract: "0xFD1dA889CeF3a6194FEa6587F836e10a8F0ba7D0",
		marketContract: "0xe3D06f136529B2e969CB99a47244B17c7081f90a",
		auctionContract: "0xcFC27BC05c79eB9e05D1DB6314a2071c720b926C",
	},
	SHARDEUM_LIBERTY_2: {
		chainId: 8081,
		chainName: "Shardeum Liberty 2.0",
		nativeCurrency: { name: "Shardeum", symbol: "SHM", decimals: 18 },
		rpcUrls: ["https://liberty20.shardeum.org/"],
		blockExplorerUrls: ["https://explorer-liberty20.shardeum.org/"],
		nftContract: "0x0Fb01DAc8e2F996651Fb76C39F44fee5c13e587e",
		nft1155Contract: "0xFD1dA889CeF3a6194FEa6587F836e10a8F0ba7D0",
		marketContract: "0x1E91870ACacd01424A207b99B3f7f54DC7F5EFB5",
		auctionContract: "0x3B29b69F87aC0c349aaD04303fC6Ac607312467e",
	},
	POLYGON_TESTNET: {
		chainId: 80001,
		rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
		chainName: "Polygon Testnet",
		nativeCurrency: {
			name: "tMATIC",
			symbol: "tMATIC",
			decimals: 18,
		},
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
		nftContract: "0xd1e21Bdb3eb28d4c6A3612FF01f9fF81c01d5a17",
		nft1155Contract: "0xd1e21Bdb3eb28d4c6A3612FF01f9fF81c01d5a17",
		marketContract: "0x227D59C0C96C90Be57f772FE6354c40EcC91CD90",
		auctionContract: "0x7E7d95087319D6aF613cA39632d857a58d2b6f37",
		listingContract: "0x571A0982E177bdD805A60b10767D3566feD5224F",
	},
};

export const CHAIN = ChainsConfig[process.env.REACT_APP_CHAIN];
