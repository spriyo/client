import {
	Box,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { DisplayHttpService } from "../api/display";
import { CardComponent } from "../components/card/CardComponent";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocationChange } from "../utils/useLocationChange";
import Web3Utils from "web3-utils";

export const ExploreScreen = ({ listen }) => {
	const displayHttpService = new DisplayHttpService();
	const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
	const [createdAt, setCreatedAt] = useState("desc");
	let skip = useRef(0);
	let createdAtRef = useRef("desc");
	let recentlyAddedItemsRef = useRef([]);
	const search = useLocation().search;
	const query = new URLSearchParams(search).get("query");
	const navigate = useNavigate();
	const chainId = useSelector((state) => state.walletReducer.chainId);

	async function getRecentlyAdded(sorted = false) {
		if (sorted) {
			skip.current = 0;
			recentlyAddedItemsRef.current = [];
			setRecentlyAddedItems(recentlyAddedItemsRef.current);
		}
		const resolved = await displayHttpService.searchAssets({
			skip: skip.current,
			createdAt: createdAtRef.current,
			query: query || "",
			chainId: Web3Utils.toHex(chainId),
		});
		skip.current += 10;
		recentlyAddedItemsRef.current = [
			...recentlyAddedItemsRef.current,
			...resolved.data,
		];
		setRecentlyAddedItems(recentlyAddedItemsRef.current);
	}

	useLocationChange((location, prevLocation) => {
		if (prevLocation && location.search !== prevLocation.search) {
			getRecentlyAdded(true);
		}
	});

	useEffect(() => {
		console.log("New value", chainId);
		if (chainId) {
			getRecentlyAdded(true);
		}
		return () => {
			console.log("Prev value", chainId);
		};
	}, [chainId]);

	return (
		<Stack>
			<NavbarComponent />
			<Box>
				<Stack p={3}>
					<Stack
						direction={"row"}
						alignItems="center"
						justifyContent={"space-between"}
					>
						<Typography sx={{ fontSize: "40px", fontWeight: "500" }}>
							Explore
						</Typography>
						<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
							<InputLabel id="sort-select-label">Sort</InputLabel>
							<Select
								labelId="sort-select-label"
								id="sort-select"
								value={createdAt}
								label="Age"
								onChange={(event) => {
									createdAtRef.current = event.target.value;
									setCreatedAt(event.target.value);
									getRecentlyAdded(true);
								}}
							>
								<MenuItem value={"desc"}>Newest</MenuItem>
								<MenuItem value={"asc"}>Oldest</MenuItem>
							</Select>
						</FormControl>
					</Stack>
					<Box paddingBottom={3}>
						<Divider></Divider>
					</Box>
					<InfiniteScroll
						dataLength={recentlyAddedItems.length}
						next={getRecentlyAdded}
						hasMore={true}
						loader={<p></p>}
						style={{ overflowX: "clip" }}
					>
						<Grid
							container
							spacing={{ xs: 2, md: 3 }}
							columns={{ xs: 4, sm: 8, md: 12 }}
						>
							{recentlyAddedItems.map((asset, index) => (
								<Grid item xs={12} sm={4} md={4} key={index}>
									<Box onClick={() => navigate("/asset/" + asset._id)}>
										<CardComponent asset={asset} />
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
