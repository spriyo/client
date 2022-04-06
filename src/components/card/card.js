import "./card.css";

export function Card({ backgroundImage, title, createdBy, price }) {
	return (
		<div
			className="card-container"
			style={{
				backgroundImage: `url('${backgroundImage}')`,
			}}
		>
			<div className="card-info">
				<div className="card-info-profileimg"></div>
				<div className="card-info-creator">
					{/* created by */}
					<p>Created : @Leostelon</p>
				</div>
				<div className="card-info-top">
					{/* title */}
					<div className="card-info-title">
						<p>Space Rex</p>
					</div>
				</div>
				<div className="card-info-bottom">
					{/* price */}
					<div className="card-info-price">
						<p>
							Price <span>6 WRX($ 1234)</span>
						</p>
					</div>
					{/* button */}
					<div className="card-info-action">
						<p>Buy now</p>
					</div>
				</div>
			</div>
		</div>
	);
}
