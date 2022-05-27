import "./topNotification.css";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../state/actions/notifications";

export const TopNotification = function () {
	const dispatch = useDispatch();
	const notifications = useSelector(
		(state) => state.notificationReducer.notifications
	);

	return notifications.length === 0 ? (
		""
	) : (
		<div className="top-notification p-6">
			<p className="top-notification-message">
				{notifications[0].message}
				&nbsp;
			</p>
			<p className="top-notification-action" onClick={notifications[0].action}>
				{notifications[0].actionTitle}
			</p>
			<div
				onClick={() => dispatch(removeNotification())}
				className="top-notification-remove"
			>
				<p>X</p>
			</div>
		</div>
	);
};
