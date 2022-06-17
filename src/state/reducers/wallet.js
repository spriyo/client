const wallet = {
	currentAddress: null,
	chainId: null,
};

export const walletReducer = (state = wallet, action) => {
	switch (action.type) {
		case "SWITCH_ACCOUNT":
			return { ...state, currentAddress: action.payload };
		case "SWITCH_CHAIN":
			localStorage.setItem("chainId", action.payload);
			return { ...state, chainId: action.payload };
		default:
			return state;
	}
};
