import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CardComponent } from "../components/card/CardComponent";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { LikeHttpService } from "../api/like";

export const FavoritesScreen = () => {
	let skip = useRef(0);
	const likeHttpService = new LikeHttpService();
	const [favoriteItems, setFavoriteItems] = useState([]);
	let favoriteItemsRef = useRef([]);
	const navigate = useNavigate();

	async function getFavorites() {
		skip.current = 0;
		favoriteItemsRef.current = [];
		setFavoriteItems(favoriteItemsRef.current);
		const resolved = await likeHttpService.getLikedAssets({
			skip: skip.current,
		});
		skip.current += 10;
		favoriteItemsRef.current = [...favoriteItemsRef.current, ...resolved.data];
		setFavoriteItems(favoriteItemsRef.current);
	}

	useEffect(() => {
		getFavorites();
		return () => {
			console.log("Prev value");
		};
	}, []);

	return (
		<Stack>
			<NavbarComponent />
			<Box>
				<Stack p={3}>
					<Box paddingBottom={3}>
						<Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
							Favorites
						</Typography>
					</Box>
					<InfiniteScroll
						dataLength={favoriteItems.length}
						next={getFavorites}
						hasMore={true}
						loader={<p></p>}
						style={{ overflowX: "clip" }}
					>
						<Grid
							container
							spacing={{ xs: 2, md: 3 }}
							columns={{ xs: 4, sm: 8, md: 12 }}
						>
							{favoriteItems.map((item, index) => (
								<Grid item xs={12} sm={4} md={4} key={index}>
									<Box
										onClick={() =>
											navigate(
												`/assets/${item.asset_id.contract_address}/${item.asset_id.item_id}`
											)
										}
									>
										<CardComponent asset={item.asset_id} />
									</Box>
								</Grid>
							))}
						</Grid>
					</InfiniteScroll>
				</Stack>
			</Box>
			<Box p={3}>
				<Divider></Divider>
			</Box>
			<FooterComponent />
		</Stack>
	);
};
