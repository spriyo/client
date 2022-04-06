import { Card } from "../card/card";
import "./collectionContainer.css";

export function CollectionContainer({ assets }) {
	return (
		<div className="collectionContainer">
			{/* Title */}
			<p className="collection-title">Trending</p>

			<div className="collection-cards-container">
				<div className="cards-container">
					{assets.slice(0, 6).map((el) => (
						<Card backgroundImage={el} />
					))}
				</div>
			</div>
			<div className="collection-action">See all</div>
		</div>
	);
}
