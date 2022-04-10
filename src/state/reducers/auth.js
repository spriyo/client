const auth = {
	authenticated: false,
};

export const authReducer = (state = auth, action) => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, authenticated: true };
		case "LOGOUT":
			return { ...state, authenticated: false };
		default:
			return state;
	}
};
