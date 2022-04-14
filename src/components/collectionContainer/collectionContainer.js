import { Card } from "../card/card";
import "./collectionContainer.css";

export function CollectionContainer({ assets, title }) {
	return (
		<div className="collectionContainer">
			{/* Title */}
			<p className="collection-title">{title}</p>

			<div className="collection-cards-container">
				<div className="cards-container">
					{assets.slice(0, 6).map((el, i) => (
						<div key={i}>
							<Card backgroundImage={el} />
						</div>
					))}
				</div>
			</div>
			<div className="collection-action">See all</div>
		</div>
	);
}
