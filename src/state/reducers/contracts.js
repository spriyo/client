const contracts = {
	marketContract: undefined,
};

export const contractReducer = (state = contracts, action) => {
	switch (action.type) {
		case "INIT_MARKET_CONTRACT":
			return {
				...state,
				marketContract: action.payload.marketContract,
			};
		default:
			return state;
	}
};
