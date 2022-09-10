import { Box, Grid } from "@mui/material";
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
				{assets.length === 0 ? (
					<Box p={2} fontWeight={500} textAlign={"center"}>
						Nothing to show here :(
					</Box>
				) : (
					<Grid
						container
						spacing={{ xs: 2, md: 3 }}
						columns={{ xs: 4, sm: 8, md: 12 }}
					>
						{assets.slice(0, 6).map((asset, index) => (
							<Grid item xs={12} sm={4} md={4} key={index}>
								<Box
									onClick={() =>
										navigate(
											`/assets/${asset.contract_address}/${asset.token_id}`
										)
									}
								>
									<CardComponent asset={asset} />
								</Box>
							</Grid>
						))}
					</Grid>
				)}
			</div>
			{/* {assets.length === 0 ? (
				""
			) : (
				<div className="collection-action">See all</div>
			)} */}
		</div>
	);
}
