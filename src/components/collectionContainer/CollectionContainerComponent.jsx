import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CardComponent } from "../card/CardComponent";
import "./collectionContainer.css";

export function CollectionContainer({ assets, title }) {
	const navigate = useNavigate();
	return (
		<div className="collectionContainer">
			{/* Title */}
			<p className="collection-title">{title}</p>

			<div className="collection-cards-container">
				<div className="cards-container">
					{assets.slice(0, 6).map((el, i) => (
						<div key={i}>
							<Box onClick={() => navigate("/asset/" + el._id)}>
								<CardComponent asset={el} />
							</Box>
						</div>
					))}
				</div>
			</div>
			<div className="collection-action">See all</div>
		</div>
	);
}
