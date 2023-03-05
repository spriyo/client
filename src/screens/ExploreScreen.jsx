import "./explorescreen.css";
import {
	Avatar,
	Box,
	Checkbox,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CardComponent } from "../components/card/CardComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocationChange } from "../utils/useLocationChange";
import { SearchHttpService } from "../api/v2/search";
import { V2_WEB_API_BASE_URL, CHAIN } from "../constants";
import { SearchComponent } from "../components/search/SearchComponent";
import axios from "axios";

export const ExploreScreen = ({ listen }) => {
	const searchHttpService = new SearchHttpService();
	const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
	const [createdAt, setCreatedAt] = useState("desc");
	let skip = useRef(0);
	let createdAtRef = useRef("desc");
	let recentlyAddedItemsRef = useRef([]);
	const search = useLocation().search;
	const query = new URLSearchParams(search).get("query");
	const navigate = useNavigate();
	const [collectionList, setCollectionList] = useState([]);
	const [selectedCollectionAddress, setSelectedCollectionAddress] =
		useState("");
	const selectedCollectionAddressRed = useRef("");
	const [selectedType, setSelectedType] = useState("");
	const selectedTypeRef = useRef("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const selectedStatusRef = useRef("");
	const [fetchingNft, setFetchingNft] = useState(true);

	async function searchAssets(byStatus) {
		setFetchingNft(true);
		const resolved = await searchHttpService.searchAssets({
			skip: skip.current,
			createdAt: createdAtRef.current,
			query: query || "",
			chainId: CHAIN.chainId,
			contract: selectedCollectionAddressRed.current,
			type: selectedTypeRef.current,
			status: selectedStatusRef.current,
			byStatus,
		});
		recentlyAddedItemsRef.current = [
			...recentlyAddedItemsRef.current,
			...resolved.data,
		];
		setRecentlyAddedItems(recentlyAddedItemsRef.current);
		setFetchingNft(false);
	}

	async function getRecentlyAdded(sorted = false) {
		if (sorted) {
			skip.current = 0;
			recentlyAddedItemsRef.current = [];
			setRecentlyAddedItems(recentlyAddedItemsRef.current);
		}
		await searchAssets();
		skip.current += 10;
	}

	async function handleCollectionChange(contract_address) {
		selectedCollectionAddressRed.current = contract_address;
		setSelectedCollectionAddress(contract_address);
		recentlyAddedItemsRef.current = [];
		setRecentlyAddedItems(recentlyAddedItemsRef.current);
		skip.current = 0;
		await searchAssets(selectedStatusRef.current ? true : false);
	}

	async function handleTypeChange(type) {
		if (type === selectedTypeRef.current) type = "";
		selectedTypeRef.current = type;
		setSelectedType(type);
		recentlyAddedItemsRef.current = [];
		setRecentlyAddedItems(recentlyAddedItemsRef.current);
		skip.current = 0;
		await searchAssets(selectedStatusRef.current ? true : false);
	}

	async function handleStatusChange(status) {
		if (status === selectedStatusRef.current) status = "";
		selectedStatusRef.current = status;
		setSelectedStatus(status);
		recentlyAddedItemsRef.current = [];
		setRecentlyAddedItems(recentlyAddedItemsRef.current);
		skip.current = 0;
		await searchAssets(status ? true : false);
	}

	useLocationChange((location, prevLocation) => {
		if (prevLocation && location.search !== prevLocation.search) {
			getRecentlyAdded(true);
		}
	});

	function onCollectionSearchChange(newValue) {
		setCollectionList([]);
		axios
			.get(
				`${V2_WEB_API_BASE_URL}/collections?limit=10&skip=0&query=${
					newValue ?? ""
				}&user_address=`
			)
			.then((data) => {
				setCollectionList(data.data);
			});
	}

	useEffect(() => {
		getRecentlyAdded(true);
		onCollectionSearchChange();
		return () => {};
	}, []);

	return (
		<Stack>
			<NavbarComponent />
			<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
				<Box
					sx={{
						maxWidth: "1400px",
						width: "100%",
						display: "flex",
						height: "95vh",
					}}
				>
					{/* NFT Filter */}
					<Box maxWidth={"20%"} className="nft_filter" mr={1}>
						{/* Status Options */}
						<Box>
							<p className="sidenav_title">Status</p>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
								className="sidenav_item"
							>
								<Checkbox
									color="default"
									onChange={() => handleStatusChange("buy")}
									checked={selectedStatus === "buy"}
								/>
								<Typography variant="h3">Buy Now</Typography>
							</Box>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
								className="sidenav_item"
							>
								<Checkbox
									color="default"
									onChange={() => handleStatusChange("auction")}
									checked={selectedStatus === "auction"}
								/>
								<Typography variant="h3">On Auction</Typography>
							</Box>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
								className="sidenav_item"
							>
								<Checkbox
									color="default"
									onChange={() => handleStatusChange("offer")}
									checked={selectedStatus === "offer"}
								/>
								<Typography variant="h3">Has Offers</Typography>
							</Box>
						</Box>
						<Box my={1}>
							<Divider></Divider>
						</Box>
						{/* Quantity */}
						<Box>
							<p className="sidenav_title">Quantity</p>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
								className="sidenav_item"
							>
								<Checkbox
									color="default"
									onChange={() => handleTypeChange("")}
									checked={selectedType === ""}
								/>
								<Typography variant="h3">All</Typography>
							</Box>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
								className="sidenav_item"
							>
								<Checkbox
									color="default"
									onChange={() => handleTypeChange("721")}
									checked={selectedType === "721"}
								/>
								<Typography variant="h3">Single - ERC721</Typography>
							</Box>
							<Box
								sx={{ display: "flex", alignItems: "center" }}
								className="sidenav_item"
							>
								<Checkbox
									color="default"
									onChange={() => handleTypeChange("1155")}
									checked={selectedType === "1155"}
								/>
								<Typography variant="h3">Multiple - ERC1155</Typography>
							</Box>
						</Box>
						<Box my={1}>
							<Divider></Divider>
						</Box>
						{/* Search Collection */}
						<Box>
							<p className="sidenav_title">Collection</p>
							<Box my={1}>
								<SearchComponent onChange={onCollectionSearchChange} />
							</Box>
							<Box>
								{collectionList.map((c) => {
									return (
										<Box className="collection_item">
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<Avatar src={c.image} alt={c.uname} />
												<Box ml={1}>
													<Typography variant="h5">{c.name}</Typography>
													<Typography variant="h6">
														By @{c.owners[0].displayName}
													</Typography>
												</Box>
											</Box>
											<Checkbox
												color="default"
												checked={
													selectedCollectionAddress === c.contract_address
												}
												onChange={() =>
													handleCollectionChange(c.contract_address)
												}
											/>
										</Box>
									);
								})}
							</Box>
						</Box>
					</Box>
					{/* NFT LIST */}
					<Box width="80%">
						<Box display="flex" alignItems={"center"} justifyContent="flex-end">
							<Box>
								<SearchComponent />
							</Box>
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
						</Box>
						{fetchingNft ? (
							<Grid
								container
								sx={{ marginLeft: "8px !important" }}
								spacing={{ xs: 2, md: 3 }}
								columns={{ xs: 4, sm: 8, md: 12 }}
							>
								{Array.from({ length: 12 }).map((j, i) => {
									return (
										<Grid item xs={12} sm={4} md={4} key={i} margin={0}>
											<Skeleton sx={{ m: 1 }} width={"100%"} height={350} />
										</Grid>
									);
								})}
							</Grid>
						) : (
							<InfiniteScroll
								dataLength={recentlyAddedItems.length}
								next={getRecentlyAdded}
								hasMore={true}
								loader={<p></p>}
								style={{ overflowX: "clip" }}
								height="95vh"
								className="nftlist"
							>
								<Grid
									container
									spacing={{ xs: 2, md: 3 }}
									columns={{ xs: 4, sm: 8, md: 12 }}
								>
									{recentlyAddedItems.map((asset, index) => (
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
							</InfiniteScroll>
						)}
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};
