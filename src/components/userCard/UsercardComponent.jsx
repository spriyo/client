import "./userCard.css";
import { CircularProfile } from "../CircularProfileComponent";

export function UsercardComponent({ user }) {
	return (
		<div className="user-card-container">
			<div className="user-card-img">
				<CircularProfile userId={user._id} userImgUrl={user.displayImage} />
			</div>
			<div className="user-card-info">
				<p className="user-card-info name">{user.displayName}</p>
				<p className="user-card-info username">
					@
					{user.username.length > 20
						? `${user.username.substring(0, 4)}...${user.username.slice(-4)}`
						: user.username}
				</p>
			</div>
			<div className="user-card-action-container">
				{/* <div className="user-card-action">
					<p>Follow</p>
				</div> */}
			</div>
		</div>
	);
}
