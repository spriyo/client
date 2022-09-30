import {
	Box,
	IconButton,
	Stack,
	Tab,
	Tabs,
	Tooltip,
	Typography,
	Grid,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FooterComponent } from "../../components/FooterComponent";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { toast } from "react-toastify";
import { CollectionHttpService } from "../../api/v2/collection";
import { useNavigate, useParams } from "react-router-dom";
import { SiDiscord, SiTwitter } from "react-icons/si";
import { IoGlobe, IoShare } from "react-icons/io5";
import { TbMinusVertical } from "react-icons/tb";
import { SearchHttpService } from "../../api/v2/search";
import { TabContext, TabPanel } from "@mui/lab";
import InfiniteScroll from "react-infinite-scroll-component";
import { CardComponent } from "../../components/card/CardComponent";
import { EmptyNftComponent } from "../../components/EmptyNftComponent";

export const Collection = () => {
	const { collection_name } = useParams();
	const collectionHttpService = new CollectionHttpService();
	const searchHttpService = new SearchHttpService();
	const [collection, setCollection] = useState({});
	const [nfts, setNfts] = useState([]);
	const [nftLoading, setNftLoading] = useState(true);
	const [tabValue, setTabValue] = useState("1");
	const navigate = useNavigate();
	let skip = useRef(0);

	async function getCollection() {
		try {
			const resolve = await collectionHttpService.getCollection(
				collection_name
			);

			console.log(resolve);
			if (!resolve.error) {
				setCollection(resolve.data);
				getNFTS(resolve.data.contract_address);
			}
		} catch (error) {
			toast(error.message);
		}
	}

	async function getNFTS(contract) {
		try {
			const resolved = await searchHttpService.searchAssets({
				contract,
				skip: (skip.current += 10),
			});
			if (!resolved.error) {
				setNfts((d) => [...d, ...resolved.data]);
				skip.current += 10;
			}
			setNftLoading(false);
		} catch (error) {
			toast(error.message);
		}
	}

	function handleTabChange(e, v) {
		setTabValue(v);
	}

	useEffect(() => {
		getCollection();
	}, []);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				justifyContent: "start",
			}}
		>
			<NavbarComponent />
			<Box
				sx={{
					flexGrow: 1,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					p: 2,
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						width: "100%",
						flexDirection: "column",
						position: "relative",
						marginBottom: "72px",
					}}
				>
					<Box
						style={{
							backgroundImage: `url(${collection.banner_image}`,
							height: "40vh",
							width: "100%",
							borderRadius: "10px",
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundRepeat: "norepeat",
						}}
					></Box>
					<Box
						sx={{
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							width: { xs: "auto", md: "40vw" },
							left: { xs: "auto", md: "60px" },
							width: "150px",
							height: "150px",
							bottom: "-64px",
							left: "64px",
							position: "absolute",
							borderRadius: "10px",
							backgroundImage: `url(${collection.image})`,
						}}
					></Box>
				</Box>
				<Box p={3}>
					<Box
						display="flex"
						height="100%"
						// alignItems="center"
						flexDirection="column"
					>
						<Stack
							flexDirection="row"
							justifyContent="space-between"
							alignItems="center"
						>
							{collection.name && (
								<Typography variant="h1" fontWeight="bold" mb={1}>
									{collection.name}
								</Typography>
							)}
							{collection.socials && (
								<Stack
									flexDirection="row"
									justifyContent="space-between"
									alignItems="center"
								>
									<Tooltip
										placement="top"
										title={
											collection.socials[0].url === ""
												? "Not Provided"
												: "Website"
										}
										arrow
									>
										<IconButton
											sx={{ mx: 1 }}
											onClick={() => {
												window.open(collection.socials[0].url, "_blank");
											}}
										>
											<IoGlobe size={24} />
										</IconButton>
									</Tooltip>
									<Tooltip
										placement="top"
										title={
											collection.socials[0].url === ""
												? "Not Provided"
												: "Discord"
										}
										arrow
									>
										<IconButton
											sx={{ mx: 1 }}
											onClick={() => {
												window.open(collection.socials[1].url, "_blank");
											}}
										>
											<SiDiscord size={24} />
										</IconButton>
									</Tooltip>
									<Tooltip
										placement="top"
										title={
											collection.socials[0].url === ""
												? "Not Provided"
												: "Twitter"
										}
										arrow
									>
										<IconButton
											sx={{ mx: 1 }}
											onClick={() => {
												window.open(collection.socials[2].url, "_blank");
											}}
										>
											<SiTwitter size={24} />
										</IconButton>
									</Tooltip>
									<TbMinusVertical />
									<IconButton sx={{ mx: 1 }}>
										<IoShare size={24} />
									</IconButton>
								</Stack>
							)}
						</Stack>

						{collection.owners && (
							<Typography
								variant="h3"
								fontWeight="normal"
								mb={1}
								onClick={() => navigate(`/${collection.owners[0].username}`)}
								sx={{ cursor: "pointer" }}
							>
								by&nbsp;
								<span style={{ fontWeight: "bold" }}>
									@{collection.owners[0].username}
								</span>
							</Typography>
						)}

						{collection.description && (
							<Typography variant="h3" fontWeight="normal">
								{collection.description}
							</Typography>
						)}
					</Box>
				</Box>
				{/* Tabs */}
				{collection.contract_address && (
					<TabContext value={tabValue}>
						<Box px={3}>
							<Box sx={{}}>
								<Tabs value={tabValue} onChange={handleTabChange}>
									<Tab label="nfts" value="1" />
									<Tab label="drop" value="2" />
								</Tabs>
							</Box>
							<TabPanel value="1" index={0}>
								{nftLoading ? (
									<Typography variant="h5">loading...</Typography>
								) : nfts.length === 0 ? (
									<EmptyNftComponent currentUser={false} />
								) : (
									<InfiniteScroll
										dataLength={nfts.length}
										next={getNFTS}
										hasMore={true}
										loader={<p></p>}
										style={{ overflowX: "clip" }}
									>
										<Grid
											container
											spacing={{ xs: 2, md: 3 }}
											columns={{ xs: 4, sm: 8, md: 12 }}
										>
											{nfts.map((asset, index) => (
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
							</TabPanel>
							<TabPanel value="2" index={1}>
								<Typography variant="h4">Drop page coming soon🚀</Typography>
							</TabPanel>
						</Box>
					</TabContext>
				)}
			</Box>
			<FooterComponent />
		</Box>
	);
};
