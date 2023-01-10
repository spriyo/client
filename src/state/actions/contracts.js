export const initMarketContract = (marketContract) => {
	return {
		type: "INIT_MARKET_CONTRACT",
		payload: {
			marketContract,
		},
	};
};

export const initAuctionContract = (auctionContract) => {
	return {
		type: "INIT_AUCTION_CONTRACT",
		payload: {
			auctionContract,
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

export const initNFT1155Contract = (nftContract) => {
	return {
		type: "INIT_NFT_1155_CONTRACT",
		payload: {
			nftContract,
		},
	};
};
