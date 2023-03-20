import "./asset.css";
import React, { useEffect, useRef, useState } from "react";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { FooterComponent } from "../../components/FooterComponent";
import { useNavigate, useParams } from "react-router-dom";
import {
	CHAIN,
	ChainsConfig,
	DOTSHM_ADDRESS,
	ERC721Contract,
	ListingContract,
	V2_WEB_API_BASE_URL,
} from "../../constants";
import { useSelector } from "react-redux";
import { CircularProfile } from "../../components/CircularProfileComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { getNetworkByChainId } from "../../utils/getNetwork";
import { getWalletAddress, switchChain } from "../../utils/wallet";
import { NFTHttpService } from "../../api/v2/nft";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import { SearchHttpService } from "../../api/v2/search";
import { RiDeleteBin5Line, RiSendPlane2Line } from "react-icons/ri";
import { CommentHttpService } from "../../api/comment";
import NoComment from "../../assets/no-comments.gif";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import DOTSHM_IMAGE from "../../assets/dotshm.png";
import LOADING_IMG from "../../assets/loading-image.gif";
import { ReactComponent as ShardeumLogoSVG } from "../../assets/shardeum-logo.svg";
import { FiGlobe, FiEye, FiExternalLink } from "react-icons/fi";
import { ActivityCardComponent2 } from "../../components/activityCard/ActivityCard2";
import { ActionsComponent2 } from "../../components/ActionsComponent2";
import { OfferCardComponent } from "../../components/activityCard/OfferCard";
import { OfferHttpService } from "../../api/offer";
import AuctionJSONInterface from "../../contracts/Auction.json";
import Web3 from "web3";
import { AiOutlineClockCircle } from "react-icons/ai";
import TransactionDialogue from "../../components/TransactionDialogue";
import axios from "axios";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { TbBorderAll, TbSquareRoundedChevronDown } from "react-icons/tb";
import { ListingCard } from "../../components/ListingCard";

export function AssetScreen() {
	const { contract_address, token_id } = useParams();
	const [asset, setAsset] = useState(null);
	const [offers, setOffers] = useState([]);
	const [auction, setAuction] = useState(false);
	const nftHttpService = new NFTHttpService();
	const offerHttpService = new OfferHttpService();
	const chainId = useSelector((state) => state.walletReducer.chainId);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [sale, setSale] = useState(false);
	const [saleList, setSaleList] = useState([]);
	const [itemFromCollection, setItemFromCollection] = useState([]);
	const searchHttpService = new SearchHttpService();
	const commentHttpService = new CommentHttpService();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	const NFTContract = useRef(null);
	const listingContract = useSelector(
		(state) => state.contractReducer.listingContract
	);
	const [transactionHash, setTransactionHash] = useState("");
	const [transactionCompleted, setTransactionCompleted] = useState(false);

	const getAsset = async function () {
		const resolved = await nftHttpService.getAssetById(
			contract_address,
			token_id
		);
		if (!resolved.error) {
			const fetchedAsset = resolved.data;
			if (fetchedAsset.owners.length > 0) {
				fetchedAsset.owner = fetchedAsset.owners[0].user;
			}
			setAsset(fetchedAsset);
			getListing();
			initializeContract(fetchedAsset.contract_address);
			getComments(fetchedAsset._id);
			getOffers(fetchedAsset._id);
		}
	};

	function handleExploreClick() {
		const cid = chainId;
		let chain;
		for (const c in ChainsConfig) {
			if (cid === ChainsConfig[c].chainId) {
				chain = ChainsConfig[c];
			}
		}
		const url = `${chain.blockExplorerUrls[0]}token/${asset.contract_address}?a=${asset.token_id}`;
		window.open(url);
	}

	async function checkApproval() {
		let isApproved = false;
		try {
			// Check for approval
			const owner = await NFTContract.current.methods
				.ownerOf(asset.token_id)
				.call();
			if (asset.owner.address !== owner.toLowerCase()) {
				alert(
					"Cancel all the auctions or sales on this NFT before transfering."
				);
			} else {
				isApproved = true;
			}
		} catch (error) {
			toast(error.message, { type: "warning" });
		}
		return isApproved;
	}

	async function getAssetsFromCollection() {
		try {
			const resolved = await searchHttpService.searchAssets({
				chainId: chainId,
				limit: 6,
				skip: 6,
				contract: contract_address,
			});
			if (!resolved.error) {
				setItemFromCollection(resolved.data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	function commentOnChange(text) {
		setComment(text);
	}

	async function writeComment(nft_id, content) {
		if (!content || comment === "" || !nft_id) return;
		const data = {
			nft_id,
			content,
		};
		const resolved = await commentHttpService.writeComment(data);
		if (!resolved.error) {
			setComments((comments) => [resolved.data, ...comments]);
			setComment("");
		}
	}

	async function getComments(nftid) {
		const resolved = await commentHttpService.getComments(nftid);
		if (!resolved.error) {
			setComments(resolved.data);
		}
	}

	async function deleteComment(commentId) {
		const resolved = await commentHttpService.deleteComment(commentId);
		if (!resolved.error) {
			setComments((comments) => comments.filter((c) => c._id !== commentId));
		}
	}

	async function approveMiddleware(callback) {
		try {
			if (!asset) return;
			if (asset.type === "1155")
				return alert(
					"Feature yet to come on ERC-1155 token, try on ERC721 token."
				);
			const chain = await getNetworkByChainId(parseInt(asset.chain_id));
			const currentChainId = await window.web3.eth.getChainId();
			if (chain.chainId !== currentChainId) {
				await switchChain(chain);
			}

			setLoading(true);
			const isApproved = await checkApproval();
			if (!isApproved) return setLoading(false);
			await callback();
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}

	async function transferNFT() {
		const currentAddress = await getWalletAddress();
		const toAddresss = prompt(
			"Please enter the address, NFT's sent to invalid address is lost forever!"
		);
		if (!toAddresss) return;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await NFTContract.current.methods
			.transferFrom(currentAddress, toAddresss, asset.token_id)
			.estimateGas({
				from: currentAddress,
			});
		await NFTContract.current.methods
			.transferFrom(currentAddress, toAddresss, asset.token_id)
			.send({ from: currentAddress, gasPrice, gas });

		// Create An Event in Backend
		const resolved = await nftHttpService.transferAsset({
			...asset,
			address: toAddresss,
		});
		if (!resolved.error) {
			window.location.reload();
		}
	}

	async function initializeContract(contract_address) {
		try {
			const contract = ERC721Contract(contract_address);
			NFTContract.current = contract;
		} catch (error) {
			toast(error.message);
		}
	}

	function addDefaultSrc(ev) {
		ev.target.src = LOADING_IMG;
	}

	async function getOffers(nft_id) {
		try {
			const resolved = await offerHttpService.getOffers(nft_id);
			if (!resolved.error) {
				setOffers(resolved.data);
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function getAuction() {
		try {
			if (window.web3) {
				const web3 = new Web3(CHAIN.rpcUrls[0]);
				const contract = new web3.eth.Contract(
					AuctionJSONInterface.abi,
					CHAIN.auctionContract
				);
				contract.methods
					.auction_by_address_id(contract_address, token_id)
					.call()
					.then((resposne) => {
						setAuction(resposne);
					});
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function buyAsset() {
		if (!sale && sale.sold) return;
		const currentAddress = await getWalletAddress();
		window.web3.eth.handleRevert = true;

		// Gas Calculation
		const gasPrice = await window.web3.eth.getGasPrice();
		const gas = await ListingContract.methods
			.buy(sale.listing_id, 1, sale.currency, currentAddress)
			.estimateGas({
				from: currentAddress,
				value: sale.pricePerToken,
			});

		listingContract.methods
			.buy(sale.listing_id, 1, sale.currency, currentAddress)
			.send({
				from: currentAddress,
				value: sale.pricePerToken,
				gasPrice,
				gas,
			})
			.on("transactionHash", function (hash) {
				setTransactionHash(hash);
			})
			.on("receipt", async function (receipt) {
				await nftHttpService.createEvent(receipt.transactionHash);
				setTransactionCompleted(true);
			});
	}

	// Get Sale
	async function getListing() {
		try {
			const response = await axios.get(
				`${V2_WEB_API_BASE_URL}/listing/${contract_address}/${token_id}`
			);
			setSale(response.data[0]);
			setSaleList(response.data);
		} catch (error) {
			console.log(error.message);
		}
	}

	useEffect(() => {
		getAsset();
		getAssetsFromCollection();
		getAuction();
		return () => {
			// window.scrollTo({ top: 0, behavior: "smooth" });
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contract_address, token_id, listingContract]);

	return (
		<Box sx={{ backgroundColor: "#efeff8" }}>
			<TransactionDialogue
				transactionHash={transactionHash}
				transactionStatus={transactionCompleted}
			/>
			<Box>
				<NavbarComponent />
			</Box>
			{asset ? (
				<Box>
					{/* Metatags */}
					<Helmet>
						{/* <!-- Primary Meta Tags --> */}
						<title>{asset.name} - Shardeum NFT - Spriyo.xyz</title>
						<meta
							name="title"
							content={`${asset.name} - Shardeum NFT - Spriyo.xyz`}
						/>
						<meta name="description" content={asset.description} />

						{/* <!-- Open Graph / Facebook --> */}
						<meta property="og:type" content="website" />
						<meta
							property="og:url"
							content={`${process.env.REACT_APP_BASE_URL}/assets/${asset.contract_address}/${asset.token_id}`}
						/>
						<meta
							property="og:title"
							content={`${asset.name} - Shardeum NFT - Spriyo.xyz`}
						/>
						<meta property="og:description" content={asset.description} />
						<meta property="og:image" content={asset.image} />

						{/* <!-- Twitter --> */}
						<meta property="twitter:card" content="summary_large_image" />
						<meta
							property="twitter:url"
							content={`${process.env.REACT_APP_BASE_URL}/assets/${asset.contract_address}/${asset.token_id}`}
						/>
						<meta
							property="twitter:title"
							content={`${asset.name} - Shardeum NFT - Spriyo.xyz`}
						/>
						<meta property="twitter:description" content={asset.description} />
						<meta property="twitter:image" content={asset.image} />
					</Helmet>

					<Stack
						sx={{
							flexDirection: { xs: "column", md: "row" },
							height: { xs: "auto", md: "85vh" },
						}}
					>
						{/* Image */}
						<Box
							flex={1}
							overflow="auto"
							height="auto"
							display={"flex"}
							justifyContent="center"
							onClick={() => window.open(asset.image, "_blank")}
							m={1}
						>
							{asset.image && asset.image.includes(".mp4") ? (
								<video
									style={{ maxWidth: "90vw", overflowX: "hidden" }}
									autoPlay
									muted
									loop
								>
									<source src={asset.image} type="video/mp4" />
								</video>
							) : (
								<img
									src={
										asset.contract_address === DOTSHM_ADDRESS
											? DOTSHM_IMAGE
											: asset.image
									}
									alt={asset.name}
									width="auto"
									style={{
										maxWidth: "90vw",
										overflowX: "hidden",
									}}
									className="main-image"
									onError={addDefaultSrc}
								/>
							)}
						</Box>
					</Stack>
					<br />
					{/* Meta Details */}
					<Box
						sx={{
							backgroundColor: "white",
							justifyContent: "center",
							alignItems: "center",
							display: "flex",
						}}
					>
						<Stack
							width="100%"
							maxWidth="1240px"
							flexDirection={{
								xs: "column",
								md: "row",
							}}
							justifyContent="space-between"
							p={1}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "start",
									mr: { xs: "0", md: "90px" },
									mt: { xs: "24px", md: "0" },
								}}
								flex={1}
								p={2}
							>
								{/* Details */}
								<Box flex={1} m={1}>
									<Box display="flex" justifyContent={"space-between"}>
										<Box mb={1}>
											{/* Title */}
											<Box>
												<Typography
													style={{ fontWeight: "600", fontSize: "40px" }}
												>
													{asset.contract_address === DOTSHM_ADDRESS
														? asset.metadata_url
														: asset.name ||
														  `#${asset.token_id.substring(0, 20)}`}
												</Typography>
												<Typography
													variant="subtitle2"
													color={"text.secondary"}
													component="p"
												>
													#{asset.token_id}
												</Typography>
											</Box>
											{/* Owned and Collection */}
											<Box mt={2} display="flex">
												{asset.owners.length > 0 && (
													<Box>
														<Typography variant="h5" color="grey">
															Owned By
														</Typography>
														<Box
															display="flex"
															alignItems="center"
															mt={1}
															onClick={() =>
																navigate(`/${asset.owners[0].address}`)
															}
														>
															{/* Image */}
															<Box>
																{asset.owners[0] && (
																	<CircularProfile
																		userId={asset.owners[0]._id}
																		userImgUrl={
																			asset.owners[0].displayImage ?? ""
																		}
																	/>
																)}
															</Box>
															{/* Name/Address */}
															<Box ml={0.5}>
																<Typography
																	variant="h5"
																	sx={{ cursor: "pointer" }}
																>
																	@
																	{(user && asset.owners[0].displayName) ||
																		asset.owners[0].address.slice(-6)}
																</Typography>
															</Box>
														</Box>
													</Box>
												)}
												<Box ml={8}>
													<Typography variant="h5" color="grey">
														Collection
													</Typography>
													<Box
														display="flex"
														alignItems="center"
														mt={1}
														onClick={() =>
															navigate(
																`/collections/${
																	asset.collection
																		? asset.collection.uname
																		: asset.contract_address
																}`
															)
														}
													>
														{/* Image */}
														<Box>
															<CircularProfile
																userId={asset.contract_address}
																userImgUrl={
																	asset.collection ? asset.collection.image : ""
																}
															/>
														</Box>
														{/* Name/Address */}
														<Box ml={0.5} sx={{ cursor: "pointer" }}>
															<Typography variant="h5">
																{(asset.collection && asset.collection.name) ||
																	asset.contract_address.slice(-6)}
															</Typography>
														</Box>
													</Box>
												</Box>
											</Box>
											{/* Owners Details */}
											{asset.type === "1155" && (
												<Box mt={4} display="flex">
													<Box mr={2} display="flex" alignItems={"center"}>
														<MdOutlinePeopleOutline
															style={{ marginRight: "4px" }}
															size={22}
														/>
														<p style={{ fontSize: "14px", fontWeight: "500" }}>
															{asset.owners_data.total_owners} owners
														</p>
													</Box>
													<Box mr={2} display="flex" alignItems={"center"}>
														<TbBorderAll
															style={{ marginRight: "4px" }}
															size={20}
														/>
														<p style={{ fontSize: "14px", fontWeight: "500" }}>
															{asset.owners_data.total_supply} items
														</p>
													</Box>
													<Box mr={2} display="flex" alignItems={"center"}>
														<TbSquareRoundedChevronDown
															style={{ marginRight: "4px" }}
															size={20}
														/>
														<p style={{ fontSize: "14px", fontWeight: "500" }}>
															You own {asset.owners_data.user_supply}
														</p>
													</Box>
												</Box>
											)}
											{/* Description */}
											<Box mt={4}>
												<Typography variant="h3">Description</Typography>
												<Typography variant="body1" fontWeight="500">
													{asset.description}
												</Typography>
											</Box>
											{/* Details */}
											<Box mt={4}>
												<Typography variant="h3">Details</Typography>
												<Stack mt={2} alignItems="center" direction="row">
													<ShardeumLogoSVG />
													<Typography variant="h5" ml={1}>
														{asset.chain_id === "8080"
															? `Liberty 1.X (${asset.type})`
															: `Liberty 2.0 (${asset.type})`}
													</Typography>
												</Stack>
												<Stack
													mt={2}
													alignItems="center"
													direction="row"
													onClick={handleExploreClick}
													sx={{ cursor: "pointer" }}
												>
													<FiGlobe size={20} />
													<Typography variant="h5" ml={1} mr={0.5}>
														View on Explorer
													</Typography>
													<FiExternalLink color="grey" />
												</Stack>
												<Stack
													mt={2}
													alignItems="center"
													direction="row"
													sx={{
														cursor: asset.metadata_url
															? "pointer"
															: "not-allowed",
													}}
													onClick={() =>
														window.open(asset.metadata_url, "_blank")
													}
												>
													<FiEye size={20} />
													<Typography variant="h5" ml={1} mr={0.5}>
														View Metadata
													</Typography>
													<FiExternalLink color="grey" />
												</Stack>
											</Box>
											{/* Commnents */}
											<Box mt={4}>
												<Typography variant="h3">Comments</Typography>
												<Box mt={"20px"}>
													{/* Write Comment */}
													<Box display="flex">
														<CircularProfile
															userId={user ? user._id : ""}
															userImgUrl={user ? user.displayImage : ""}
														/>
														<Box sx={{ width: "100%", ml: "16px" }}>
															{/* Custom Textfield */}
															<Box sx={{ borderRadius: "12px" }}>
																<TextField
																	sx={{
																		backgroundColor: "white",
																		borderRadius: "12px",
																		paddingX: "12px",
																		paddingY: "10px",
																	}}
																	variant="standard"
																	InputProps={{
																		disableUnderline: true,
																		endAdornment: (
																			<IconButton
																				onClick={() => {
																					if (!user) return;
																					writeComment(asset._id, comment);
																				}}
																				sx={{
																					cursor: user
																						? "pointer"
																						: "not-allowed",
																				}}
																			>
																				<RiSendPlane2Line size={16} />
																			</IconButton>
																		),
																	}}
																	fullWidth
																	placeholder={
																		user
																			? "Write your comment"
																			: "Connect wallet to comment"
																	}
																	id="fullWidth"
																	value={comment}
																	onChange={(e) =>
																		commentOnChange(e.target.value)
																	}
																/>
															</Box>
														</Box>
													</Box>
													{/* Comment List */}
													{comments.length === 0 ? (
														<Box
															sx={{
																backgroundColor: "white",
																mt: "8px",
																p: 2,
																borderRadius: "12px",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																flexDirection: "column",
															}}
														>
															<img
																width={"75px"}
																src={NoComment}
																alt="no comment"
															></img>
															<Typography variant="h5">
																Be the first to comment😃
															</Typography>
														</Box>
													) : (
														comments.map((comment, i) => {
															return (
																<Box display="flex" mt={"14px"} key={i}>
																	<CircularProfile
																		userId={comment.userId._id}
																		userImgUrl={comment.userId.displayImage}
																	/>
																	<Box sx={{ width: "100%", ml: "16px" }}>
																		<Box
																			sx={{
																				backgroundColor: "white",
																				borderRadius: "12px",
																				paddingX: "12px",
																				paddingY: "10px",
																			}}
																		>
																			<Stack
																				flexDirection="row"
																				justifyContent="space-between"
																			>
																				<Typography variant="h6">
																					{comment.userId.username}
																				</Typography>
																				{comment.userId._id === user._id && (
																					<IconButton
																						size="small"
																						sx={{
																							"&:hover": {
																								color: "red",
																							},
																						}}
																						onClick={() =>
																							deleteComment(comment._id)
																						}
																					>
																						<RiDeleteBin5Line size={14} />
																					</IconButton>
																				)}
																			</Stack>
																			<Typography
																				sx={{
																					fontSize: "12px",
																					color: "text.primary",
																				}}
																			>
																				{comment.content}
																			</Typography>
																			<Box mt={"4px"}></Box>
																			<p
																				style={{
																					fontSize: "10px",
																					fontWeight: "500",
																					color: "text.secondary",
																				}}
																			>
																				{`${new Date(
																					comment.createdAt
																				).toDateString()}, ${new Date(
																					comment.createdAt
																				).toLocaleTimeString()}`}
																			</p>
																		</Box>
																	</Box>
																</Box>
															);
														})
													)}
												</Box>
											</Box>
										</Box>
										{user &&
										asset &&
										asset.owners[0] &&
										user._id === asset.owners[0]._id ? (
											<Box>
												<ButtonComponent
													text={loading ? "Transfering..." : "Transfer ▶️"}
													onClick={() => {
														if (loading) return;
														approveMiddleware(transferNFT);
													}}
												/>
											</Box>
										) : (
											""
										)}
									</Box>
								</Box>
							</Box>
							{/* Activity & Offers */}
							<Box flex={1} mt={4}>
								<Box>
									{auction && (
										<h5>{`Auction expires at ${new Date(
											parseInt(auction.expireAt) * 1000
										).toLocaleString()}`}</h5>
									)}
									<ActionsComponent2 asset={asset} />
									{asset.type === "721" && sale && !sale.sold && (
										<Box sx={{ border: " 1px solid #ebebeb", p: 2, my: 2 }}>
											<Box display={"flex"}>
												<AiOutlineClockCircle
													style={{ marginRight: "4px" }}
													size={24}
												/>
												Sale ends at{" "}
												{`${new Date(
													parseInt(sale.endTimestamp) * 1000
												).toLocaleString()}`}
											</Box>

											<Box my={1}>
												<h4 style={{ color: "grey" }}>Price</h4>
												<h3>{Web3.utils.fromWei(sale.pricePerToken)} SHM</h3>
											</Box>
											<Box>
												<Box
													sx={{
														backgroundColor: "#00e472",
														borderRadius: "8px",
														px: 0.5,
														py: 1,
														textAlign: "center",
														fontSize: "18px",
														fontWeight: "500",
														cursor: "pointer",
													}}
													onClick={buyAsset}
												>
													Buy Now
												</Box>
											</Box>
										</Box>
									)}

									<Box mb={2}>
										<Typography variant="h3">Listings</Typography>
										{saleList.length === 0 ? (
											<Typography variant="h3" color="lightgrey">
												No Listings
											</Typography>
										) : (
											<Box>
												<Box className="activityScroll">
													{saleList.map((e, i) => (
														<ListingCard listing={e} key={i} />
													))}
												</Box>
											</Box>
										)}
									</Box>

									{/* Offers */}
									<Typography variant="h3">Offers</Typography>
									{offers.length === 0 ? (
										<Typography variant="h3" mb={2} color="lightgrey">
											No Offers
										</Typography>
									) : (
										<Box>
											<Box className="activityScroll">
												{offers.map((e, i) => (
													<Box key={i}>
														<OfferCardComponent asset={asset} offer={e} />
													</Box>
												))}
											</Box>
										</Box>
									)}
								</Box>
								<Box>
									{/* Activity */}
									<Typography variant="h3">Activity</Typography>
									{asset.events.length === 0 ? (
										<Typography variant="h3" color="lightgrey">
											No Activity
										</Typography>
									) : (
										<Box>
											<Box className="activityScroll">
												{asset.events.map((e, i) => (
													<Box key={i}>
														<ActivityCardComponent2 event={e} asset={asset} />
													</Box>
												))}
											</Box>
										</Box>
									)}
								</Box>
							</Box>
						</Stack>
					</Box>
				</Box>
			) : (
				<Box
					height="50vh"
					display="flex"
					justifyContent="center"
					alignItems="center"
				>
					<p>loading</p>
				</Box>
			)}
			<Box
				sx={{
					margin: { xs: "12px", md: "24px 40px" },
					justifyContent: "center",
					alignItems: "center",
					display: "flex",
				}}
			>
				<Box
					sx={{
						maxWidth: "1400px",
					}}
				>
					<CollectionContainer
						title={"More from this Collection"}
						assets={itemFromCollection}
					/>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
}
