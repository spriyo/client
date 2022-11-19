import {
	Box,
	IconButton,
	Stack,
	Tab,
	Tabs,
	Tooltip,
	Typography,
	Grid,
	Divider,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FooterComponent } from "../../components/FooterComponent";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { toast } from "react-toastify";
import { CollectionHttpService } from "../../api/v2/collection";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { SiDiscord, SiTelegram, SiTwitter } from "react-icons/si";
import { BiPlus, BiMinus } from "react-icons/bi";
import { IoGlobe, IoShare } from "react-icons/io5";
import { TbMinusVertical } from "react-icons/tb";
import { AiOutlineBlock } from "react-icons/ai";
import { SearchHttpService } from "../../api/v2/search";
import { TabContext, TabPanel } from "@mui/lab";
import InfiniteScroll from "react-infinite-scroll-component";
import { CardComponent } from "../../components/card/CardComponent";
import { EmptyNftComponent } from "../../components/EmptyNftComponent";
import { DropHttpService } from "../../api/v2/drop";
import YogamersContractJSON from "../../contracts/Yogamers.json";
import { ButtonComponent } from "../../components/ButtonComponent";
import { getWalletAddress } from "../../utils/wallet";
import NoDrop from "../../assets/nodrop.jpg";
import Web3 from "web3";

const mapping = {
	twitter: <SiTwitter size={24} />,
	website: <IoGlobe size={24} />,
	discord: <SiDiscord size={24} />,
	telegram: <SiTelegram size={24} />,
};

export const Collection = () => {
	const { collection_name } = useParams();
	const [searchParams] = useSearchParams();
	const collectionHttpService = new CollectionHttpService();
	const searchHttpService = new SearchHttpService();
	const dropHttpService = new DropHttpService();
	const [collection, setCollection] = useState(undefined);
	const [contract, setContract] = useState(undefined);
	const [drop, setDrop] = useState({});
	const [nfts, setNfts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [nftLoading, setNftLoading] = useState(true);
	const [tabValue, setTabValue] = useState("1");
	const [quantity, setQuantity] = useState(1);
	const navigate = useNavigate();
	let skip = useRef(0);
	const NFTContract = useRef();

	async function getCollection() {
		try {
			const resolve = await collectionHttpService.getCollection(
				collection_name
			);

			if (!resolve.error) {
				setCollection(resolve.data);
				const tab = searchParams.get("tab");
				if (tab && tab === "0") {
					setTabValue("1");
				} else if (tab && tab === "1") {
					setTabValue("2");
				}
				getDrop(resolve.data._id);
				getContract(resolve.data.contract_address);
			}
		} catch (error) {
			toast(error.message);
		}
	}

	async function getContract(address) {
		try {
			const resolved = await collectionHttpService.getContract(address);
			if (!resolved.error) {
				if (!resolved.data.collection) {
					const col = {
						banner_image: "",
						image: "",
						contract_address: resolved.data.address,
						socials: [],
						owners: [{ username: resolved.data.creator }],
					};
					setCollection(col);
				} else {
					setCollection(resolved.data.collection);
				}
				setContract(resolved.data);
				getNFTS(resolved.data.address);
			}
			return resolved;
		} catch (error) {
			alert(error.message);
		}
	}

	async function getNFTS(contract) {
		try {
			const resolved = await searchHttpService.searchAssets({
				contract,
				skip: skip.current,
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

	async function getDrop(collection_id) {
		try {
			const resolved = await dropHttpService.getDropByCollectionId(
				collection_id
			);
			if (!resolved.error) {
				setDrop(resolved.data);
				initializeContract(resolved.data.contract_address);
			}
		} catch (error) {
			toast(error.message);
		}
	}

	function handleTabChange(e, v) {
		setTabValue(v);
	}

	async function initializeContract(contract_address) {
		try {
			const contract = new window.web3.eth.Contract(
				YogamersContractJSON.abi,
				contract_address
			);
			NFTContract.current = contract;
		} catch (error) {
			toast(error.message);
		}
	}

	async function mint() {
		if (loading) return;
		try {
			setLoading(true);
			const currentAddress = await getWalletAddress();
			const transaction = await NFTContract.current.methods
				.mint(currentAddress, quantity)
				.send({
					from: currentAddress,
					value: Web3.utils.toWei(drop.amount) * quantity,
				});

			// const resolved = await uploadToServer(
			// 	parseInt(transaction.events.Transfer.returnValues.tokenId),
			// 	transaction.events.Transfer.returnValues.to
			// );
			// if (!resolved.error) {
			// 	toast("Successfully minted", { type: "success" });
			// }
			let ids;
			if (Array.isArray(transaction.events.Transfer)) {
				ids = transaction.events.Transfer.map(
					(a) => a.returnValues.tokenId
				).join(", ");
			} else {
				ids = transaction.events.Transfer.returnValues.tokenId;
			}
			alert(
				`Token with ID ${ids} is minted and will be reflected in your profile shortly🥳`
			);
			navigate("/");
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
		setLoading(false);
	}

	// async function uploadToServer(itemId, owner) {
	// 	try {
	// 		let data = {};
	// 		data["image"] = drop.image;
	// 		data["name"] = drop.title;
	// 		data["description"] = drop.description;
	// 		data["chain_id"] = "8080";
	// 		data["contract_address"] = drop.contract_address;
	// 		data["metadata_url"] = drop.metadata_url;
	// 		data["token_id"] = itemId;
	// 		data["type"] = "721";
	// 		data["owner"] = owner;
	// 		data["value"] = "1";
	// 		data["metadata"] = drop.metadata;

	// 		const resolved = await dropHttpService.createDropNFT(data);
	// 		return resolved;
	// 	} catch (error) {
	// 		toast(error.message, { type: "warning" });
	// 	}
	// }

	useEffect(() => {
		if (Web3.utils.isAddress(collection_name)) {
			getContract(collection_name);
		} else {
			getCollection();
		}
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
				{collection && (
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
								backgroundColor: "currentcolor",
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
								bottom: "-48px",
								left: "64px",
								position: "absolute",
								borderRadius: "10px",
								backgroundImage: `url(${collection.image})`,
							}}
						>
							{collection.image &&
								typeof collection.image === String &&
								collection.image.includes(".mp4") && (
									<video
										style={{
											height: "100%",
											width: "100%",
											borderRadius: "10px",
										}}
										autoPlay
										muted
										loop
									>
										<source src={collection.image} type="video/mp4" />
									</video>
								)}
						</Box>
					</Box>
				)}
				<Box p={1}>
					{collection && (
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
								mb={2}
							>
								<Typography style={{ fontWeight: "600", fontSize: "40px" }}>
									{collection.name}
								</Typography>

								<Stack
									flexDirection="row"
									justifyContent="space-between"
									alignItems="center"
								>
									<Tooltip
										placement="top"
										title={
											<Box>
												<p>View on Explorer</p>
												<small>{`${collection.contract_address.substring(
													0,
													6
												)}...${collection.contract_address.slice(-4)}`}</small>
											</Box>
										}
										componentsProps={{
											tooltip: {
												sx: {
													textAlign: "center",
												},
											},
										}}
										arrow
									>
										<IconButton sx={{ mx: 1 }} onClick={() => {}}>
											<AiOutlineBlock />
										</IconButton>
									</Tooltip>
									{collection.socials.map((ele, i) => {
										return (
											<Tooltip
												key={i}
												placement="top"
												title={ele.url === "" ? "Not Provided" : ele.type}
												arrow
											>
												<IconButton
													sx={{ mx: 1 }}
													onClick={() => {
														if (!ele.url.includes("https://"))
															ele.url = `https://${ele.url}`;
														window.open(ele.url, "_blank");
													}}
												>
													{mapping[ele.type]}
												</IconButton>
											</Tooltip>
										);
									})}
									<TbMinusVertical />
									<IconButton sx={{ mx: 1 }}>
										<IoShare size={24} />
									</IconButton>
								</Stack>
							</Stack>
							{/* Creation Date */}
							<Typography variant="h3" color={"text.secondary"}>
								{`Created ${new Date(
									contract && (contract.timestamp || contract.createdAt)
								).toLocaleString("default", {
									month: "short",
									year: "numeric",
								})}`}
							</Typography>

							{contract && (
								<Typography
									variant="h3"
									fontWeight="normal"
									onClick={() =>
										navigate(
											`/${
												contract.owners[0]
													? contract.owners[0].username
													: contract.creator
											}`
										)
									}
									sx={{ cursor: "pointer", my: 1 }}
								>
									<b style={{ fontWeight: "600" }}>By&nbsp;</b>
									<span style={{ fontWeight: "bold" }}>
										{contract.owners[0]
											? contract.owners[0].username
											: contract.creator}
									</span>
								</Typography>
							)}
							{contract && (
								<Box display="flex">
									<Box mt={1} mr={5}>
										<Typography variant="h2" fontWeight={"bold"}>
											{contract.nfts_count.count}
										</Typography>
										<Typography variant="h3" fontWeight="medium">
											Items
										</Typography>
									</Box>
									<Box mt={1} mr={5}>
										<Typography variant="h2" fontWeight={"bold"}>
											{contract.owners_count.count}
										</Typography>
										<Typography variant="h3" fontWeight="medium">
											Owners
										</Typography>
									</Box>
									<Box mt={1} mr={5}>
										<Typography variant="h2" fontWeight={"bold"}>
											{Math.floor(
												(contract.owners_count.count /
													contract.nfts_count.count) *
													100
											)}
											%
										</Typography>
										<Typography variant="h3" fontWeight="medium">
											Unique Owners
										</Typography>
									</Box>
								</Box>
							)}
							<Typography variant="h3" fontWeight="medium" mt={2}>
								{collection.description ||
									`Explore the best NFTs in this collection exclusively on Spriyo🌈`}
							</Typography>
						</Box>
					)}
				</Box>
				{/* Tabs */}
				{collection && (
					<TabContext value={tabValue}>
						<Box p={1}>
							<Box>
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
										next={() => getNFTS(collection.contract_address)}
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
								{drop && drop.title ? (
									<Box
										sx={{
											display: "flex",
											w: "100%",
											p: 1,
											flexDirection: { xs: "column", md: "row" },
											alignItems: "center",
										}}
									>
										<Box
											sx={{
												flex: 1,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												p: 3,
											}}
										>
											{drop.image && drop.image.includes(".mp4") ? (
												<video
													style={{
														objectFit: "cover",
														overflow: "hidden",
														width: "90%",
														height: "90%",
														borderRadius: "12px",
													}}
													autoPlay
													muted
													loop
												>
													<source src={drop.image} type="video/mp4" />
												</video>
											) : (
												<img
													src={drop.image}
													alt={drop.title}
													style={{
														objectFit: "cover",
														overflow: "hidden",
														width: "90%",
														height: "90%",
														borderRadius: "12px",
													}}
												/>
											)}
										</Box>
										<Box
											sx={{
												flex: 1,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexDirection: "column",
												m: 1,
												mt: 2,
												width: "100%",
												maxWidth: "40vw",
											}}
										>
											<Typography variant="h2">Details</Typography>
											<br />
											<Box px={1} width="100%">
												<Tile title={"Title"} value={drop.title} />
												{drop.contract_address && (
													<Tile
														title={"Contract Address"}
														value={`${drop.contract_address.substr(
															0,
															6
														)}...${drop.contract_address.substr(-6)}`}
													/>
												)}
												<Tile title={"Blockchain"} value={`Shardeum Liberty`} />
												<Tile title={"Token Standard"} value={`ERC721`} />
												<Tile title={"Price"} value={`${drop.amount} SHM`} />
												<Divider sx={{ width: "100%" }} />
												<Box
													display={"flex"}
													justifyContent="space-between"
													alignItems="center"
													width="100%"
												>
													<Box>
														<Typography variant="h5">Quantity</Typography>
													</Box>
													<Box
														display="flex"
														sx={{
															border: "1px solid lightgrey",
															borderRadius: "6px",
															m: 1,
														}}
													>
														{/* Minus */}
														<IconButton
															onClick={() => {
																let val;
																quantity > 1
																	? (val = quantity - 1)
																	: (val = quantity);
																setQuantity(val);
															}}
														>
															<BiMinus />
														</IconButton>
														{/* Number */}
														<Box p={1} sx={{ borderRadius: "4px" }}>
															{quantity}
														</Box>
														{/* Plus */}
														<IconButton
															onClick={() => setQuantity((q) => q + 1)}
														>
															<BiPlus />
														</IconButton>
													</Box>
												</Box>
											</Box>
											{/* Create Button */}
											<Box className="createscreen-create-button">
												<ButtonComponent
													text={loading ? "Loading..." : "Mint"}
													onClick={mint}
												/>
											</Box>
										</Box>
									</Box>
								) : (
									<Box
										sx={{
											maxWidth: "100%",
											display: "flex",
											alignItems: "center",
											flexDirection: "column",
											justifyContent: "center",
										}}
									>
										<Box
											sx={{
												maxWidth: "40vw",
											}}
										>
											<img src={NoDrop} alt="no drop" width="100%" />
										</Box>
										&nbsp;
										<h3>Hold on, they are dropping it!</h3>
									</Box>
								)}
								&nbsp;
								<Box
									style={{
										textAlign: "center",
										display: "flex",
										justifyContent: "center",
									}}
								>
									<Box
										sx={{
											padding: "8px",
											whiteSpace: "nowrap",
											backgroundColor: "#00c775",
											display: "flex",
											borderRadius: "8px",
											color: "black",
											fontWeight: "600",
										}}
									>
										Claim 100 Liberty SHM &nbsp;
										<a
											href="https://faucet.liberty20.shardeum.org/"
											target={"_blank"}
											rel="noreferrer"
											style={{ color: "white" }}
										>
											click here
										</a>
									</Box>
								</Box>
							</TabPanel>
						</Box>
					</TabContext>
				)}
			</Box>
			<FooterComponent />
		</Box>
	);
};

export const Tile = ({ title, value }) => {
	return (
		<Box
			display={"flex"}
			justifyContent="space-between"
			width="100%"
			alignItems="center"
			my={1}
		>
			<Typography color="grey" variant="h5">
				{title}
			</Typography>
			<Typography variant="h3">{value}</Typography>
		</Box>
	);
};
