import "./activityCard.css";

export function ActivityCardComponent() {
	return (
		<div className="activity-card-container">
			<div className="activity-card-img"></div>
			<div className="activity-card-info">
				<p className="activity-card-info info">
					<span className="highlight">0.3 ETH</span>&nbsp; by &nbsp;
					<span className="highlight">KidEight</span>&nbsp; for 1 edition
				</p>
				<p className="activity-card-info time">10 JUl 2021, 09:18 PM</p>
			</div>
		</div>
	);
}
