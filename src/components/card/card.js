import "./card.css";

export function Card({ backgroundImage, title, createdBy, price }) {
	return (
		<div
			className="card-container"
			style={{
				backgroundImage: `url('${backgroundImage}')`,
			}}
		>
			<div className="card-info-container">
				<div>
					{/* title */}
					<p>Space Rex</p>
					{/* created by */}
					<p>@leostelon</p>
				</div>
				<div>
					{/* price */}
					<p>
						Price <span>6 WRX($ 1234)</span>
					</p>
					{/* button */}
					<p>buy</p>
				</div>
			</div>
		</div>
	);
}
