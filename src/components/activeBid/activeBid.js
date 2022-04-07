import { ActivityCardComponent } from "../activityCard/activityCard";
import "./activeBid.css";

export function ActiveBidComponent() {
	return (
		<div className="activebid-container">
			<div className="activebid-body">
				{/* Title */}
				<div className="activebid-title">
					<p className="activebid-title-name">Storm NFT</p>
					<p className="activebid-title-id">NFT ID : 389756</p>
				</div>
				{/* User */}
				<div className="activebid-user-container">
					<div className="activebid-user-img"></div>
					<div className="activebid-user-info">
						<p className="activebid-user-info name">Leo Stelon</p>
						<p className="activebid-user-info username">@leostelon</p>
					</div>
				</div>
				{/* Data */}
				<div className="activebid-bidder">
					<div className="activebid-bidder-time">
						{/* Timer */}
						<div>
							<p>Ending In</p>
							<p>02h 23m 23s</p>
						</div>
						{/* Profile */}
						<div className="active-bidder-current">
							<div>
								<p>Highest bid</p>
								<p>3.2 ETH</p>
							</div>
							<div className="active-bidder-current img"></div>
						</div>
					</div>
					<div className="activebid-bidder-actions container">
						<div className="activebid-bidder-action">
							<p>Place a bid</p>
						</div>
					</div>
				</div>
				{/* Bids */}
				{/* Bid Title */}
				<div className="activebids-list-container">
					<div className="activebids-list-title">
						<p>Bids</p>
					</div>
					<div className="activebids-list-bids">
						<ActivityCardComponent />
						<ActivityCardComponent />
					</div>
				</div>
			</div>
			<div className="activebid-img-container"></div>
		</div>
	);
}
