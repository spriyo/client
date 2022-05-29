const contracts = {
	marketContract: undefined,
	nftContract: undefined,
};

export const contractReducer = (state = contracts, action) => {
	switch (action.type) {
		case "INIT_MARKET_CONTRACT":
			return {
				...state,
				marketContract: action.payload.marketContract,
			};
		case "INIT_NFT_CONTRACT":
			return {
				...state,
				nftContract: action.payload.nftContract,
			};
		default:
			return state;
	}
};
