export const initMarketContract = (marketContract) => {
	return {
		type: "INIT_MARKET_CONTRACT",
		payload: {
			marketContract,
		},
	};
};

export const initNFTContract = (nftContract) => {
	return {
		type: "INIT_NFT_CONTRACT",
		payload: {
			nftContract,
		},
	};
};
