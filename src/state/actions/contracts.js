export const initMarketContract = (marketContract) => {
	return {
		type: "INIT_MARKET_CONTRACT",
		payload: {
			marketContract,
		},
	};
};
