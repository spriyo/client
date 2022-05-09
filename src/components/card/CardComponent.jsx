import "./card.css";

export function CardComponent({ asset }) {
	return (
		<div
			className="card-container"
			style={{
				backgroundImage: `url('${
					asset.medias.length !== 0 ? asset.medias[0].path : ""
				}')`,
			}}
		>
			<div className="card-info">
				<div
					className="card-info-profileimg"
					style={{
						backgroundImage: `url('${asset.owner.displayImage}')`,
					}}
				></div>
				<div className="card-info-creator">
					{/* created by */}
					<p>Created : @{asset.created_by.displayName}</p>
				</div>
				<div className="card-info-top">
					{/* title */}
					<div className="card-info-title">
						<p>{asset.name}</p>
					</div>
				</div>
				<div className="card-info-bottom">
					<p></p>
					{/* price
					<div className="card-info-price">
						<p>
							Price <span>6 WRX($ 1234)</span>
						</p>
					</div> */}
					{/* button */}
					<div className="card-info-action">
						<p>Buy now</p>
					</div>
				</div>
			</div>
		</div>
	);
}
