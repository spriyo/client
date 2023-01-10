const contracts = {
	marketContract: undefined,
	auctionContract: undefined,
	nftContract: undefined,
	nft1155Contract: undefined,
};

export const contractReducer = (state = contracts, action) => {
	switch (action.type) {
		case "INIT_MARKET_CONTRACT":
			return {
				...state,
				marketContract: action.payload.marketContract,
			};
		case "INIT_AUCTION_CONTRACT":
			return {
				...state,
				auctionContract: action.payload.auctionContract,
			};
		case "INIT_NFT_CONTRACT":
			return {
				...state,
				nftContract: action.payload.nftContract,
			};
		case "INIT_NFT_1155_CONTRACT":
			return {
				...state,
				nft1155Contract: action.payload.nftContract,
			};
		default:
			return state;
	}
};
