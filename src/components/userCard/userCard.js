import "./userCard.css";

export function UserCardComponent() {
	return (
		<div className="user-card-container">
			<div className="user-card-img"></div>
			<div className="user-card-info">
				<p className="user-card-info name">Leo Stelon</p>
				<p className="user-card-info username">@leostelon</p>
			</div>
			<div className="user-card-action-container">
				<div className="user-card-action">
					<p>Follow</p>
				</div>
			</div>
		</div>
	);
}
