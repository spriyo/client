const notifications = {
	notifications: [],
};

export const notificationReducer = (state = notifications, action) => {
	switch (action.type) {
		case "ADD_NOTIFICATION":
			const notifs = state.notifications.filter(
				(n) => n.id === action.payload.id
			);
			if (notifs.length >= 1) return;
			const newNotification = {
				message: action.payload.message,
				action: action.payload.action,
				id: action.payload.id,
				actionTitle: action.payload.actionTitle,
			};
			return {
				...state,
				notifications: [...state.notifications, newNotification],
			};
		case "REMOVE_NOTIFICATION":
			const removedNotifications = state.notifications.filter(
				(n, i) => i !== 0
			);
			return { ...state, notifications: removedNotifications };
		case "CLEAR_NOTIFICATION":
			return { ...state, notifications: [] };
		default:
			return state;
	}
};
