import "./card.css";

export function CardComponent({ asset }) {
	return (
		<div
			className="card-container"
			style={{
				backgroundImage:
					asset.type === "video"
						? "none"
						: `url('${
								asset.image ||
								(asset.medias.length !== 0 ? asset.medias[0].path : "")
						  }')`,
			}}
		>
			{asset.type === "video" ? (
				<video className="video-component" autoPlay muted loop>
					<source src={asset.medias[0].path} type="video/mp4" />
				</video>
			) : (
				<div></div>
			)}
			<div className="card-info">
				<div
					className="card-info-profileimg"
					style={{
						backgroundImage: `url('${asset.owner.displayImage}')`,
					}}
				></div>
				<div className="card-info-creator">
					{/* created by */}
					<p>
						{asset.created_by && `Created : @${asset.created_by.displayName}`}
					</p>
				</div>
				<div className="card-info-top">
					{/* title */}
					<div className="card-info-title">
						<p>{asset.name}</p>
					</div>
				</div>
				<div className="card-info-bottom">
					{/* Event */}
					<div className="card-info-price">
						<p>
							{asset.events
								? asset.events.length === 0
									? "" // no events
									: asset.events[0].event_type.replace("_", " ").toUpperCase()
								: "Events Not present"}
						</p>
					</div>
					{/* price
					<div className="card-info-price">
						<p>
							Price <span>6 WRX($ 1234)</span>
						</p>
					</div> */}
					{/* button */}
					{/* <div className="card-info-action">
						<p>Buy now</p>
					</div> */}
				</div>
			</div>
		</div>
	);
}
