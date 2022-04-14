const auth = {
	authenticated: false,
	user: null,
};

export const authReducer = (state = auth, action) => {
	switch (action.type) {
		case "LOGIN":
			return { ...state, authenticated: true, user: action.payload.user };
		case "LOGOUT":
			return { ...state, authenticated: false };
		default:
			return state;
	}
};
