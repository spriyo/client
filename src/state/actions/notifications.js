export const addNotification = (message, actionTitle, action) => {
	return {
		type: "ADD_NOTIFICATION",
		payload: {
			message,
			action,
			actionTitle,
		},
	};
};

export const removeNotification = () => {
	return {
		type: "REMOVE_NOTIFICATION",
	};
};

export const clearNotification = () => {
	return {
		type: "CLEAR_NOTIFICATION",
	};
};
