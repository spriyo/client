export const switchAccount = (newAddress) => {
	return {
		type: "SWITCH_ACCOUNT",
		payload: newAddress,
	};
};

export const switchChain = (chainId) => {
	return {
		type: "SWITCH_CHAIN",
		payload: chainId,
	};
};
