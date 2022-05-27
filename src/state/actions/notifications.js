export const addNotification = (message, actionTitle, id, action) => {
	return {
		type: "ADD_NOTIFICATION",
		payload: {
			message,
			action,
			id,
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
