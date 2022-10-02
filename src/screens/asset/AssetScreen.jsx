import "./asset.css";
import React, { useEffect, useRef, useState } from "react";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import {
	Box,
	Chip,
	IconButton,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FooterComponent } from "../../components/FooterComponent";
import { useNavigate, useParams } from "react-router-dom";
import { BiLinkExternal } from "react-icons/bi";
import { ChainsConfig } from "../../constants";
import { useSelector } from "react-redux";
import { ActionsComponent } from "../../components/ActionsComponent";
import { ActivityCardComponent } from "../../components/activityCard/ActivityCard";
import { CircularProfile } from "../../components/CircularProfileComponent";
import { ButtonComponent } from "../../components/ButtonComponent";
import { getNetworkByChainId } from "../../utils/getNetwork";
import { getChainId, getWalletAddress, switchChain } from "../../utils/wallet";
import { NFTHttpService } from "../../api/v2/nft";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import { SearchHttpService } from "../../api/v2/search";
import { RiDeleteBin5Line, RiSendPlane2Line } from "react-icons/ri";
import { CommentHttpService } from "../../api/comment";
import NoComment from "../../assets/no-comments.gif";
import { Helmet } from "react-helmet";
import NFTContractJSON from "../../contracts/Spriyo.json";
import { toast } from "react-toastify";

export function AssetScreen() {
	const { contract_address, token_id } = useParams();
	const [asset, setAsset] = useState(null);
	const nftHttpService = new NFTHttpService();
	const chainId = useSelector((state) => state.walletReducer.chainId);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [itemFromCollection, setItemFromCollection] = useState([]);
	const searchHttpService = new SearchHttpService();
	const commentHttpService = new CommentHttpService();
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");
	const NFTContract = useRef(null);

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
			initializeContract(fetchedAsset.contract_address);
			getComments(fetchedAsset._id);
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
			const currentChainId = await getChainId();
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
			const contract = new window.web3.eth.Contract(
				NFTContractJSON.abi,
				contract_address
			);
			NFTContract.current = contract;
		} catch (error) {
			toast(error.message);
		}
	}

	useEffect(() => {
		getAsset();
		getAssetsFromCollection();
		return () => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		};
	}, [contract_address, token_id]);

	return (
		<Box sx={{ backgroundColor: "#efeff8" }}>
			<Box>
				<NavbarComponent />
			</Box>
			{asset ? (
				<Box sx={{ margin: { xs: "12px", md: "24px 40px" } }}>
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

					<Box p={2} bgcolor="white" borderRadius="10px">
						<Stack
							sx={{
								flexDirection: { xs: "column", md: "row" },
								height: { xs: "auto", md: "80vh" },
							}}
						>
							{/* Image */}
							<Box
								flex={1}
								overflow="auto"
								height="auto"
								display={"flex"}
								justifyContent="center"
								borderRadius={"10px"}
								onClick={() =>
									window.open(asset.image || asset.medias[0].path, "_blank")
								}
								m={1}
							>
								{asset.image.includes(".mp4") ? (
									<video style={{ maxHeight: "40vh" }} autoPlay muted loop>
										<source src={asset.image} type="video/mp4" />
									</video>
								) : (
									<img
										src={asset.image || asset.medias[0].path}
										alt={asset.name}
										width="100%"
										height="auto"
										className="main-image"
									/>
								)}
							</Box>
							{/* Details */}
							<Box flex={1} m={1}>
								<Box display="flex" justifyContent={"space-between"}>
									<Box mb={1}>
										<Typography variant="h1">{asset.name}</Typography>
										<Typography
											variant="subtitle2"
											color={"text.secondary"}
											component="p"
										>
											NFT ID : {asset.token_id}
										</Typography>
										{asset.type === "721" ? (
											<Typography
												sx={{ color: "text.secondary" }}
												variant="subtitle2"
											>
												ERC-721
											</Typography>
										) : (
											<Typography
												sx={{ color: "text.secondary" }}
												variant="subtitle2"
											>
												ERC-1155
											</Typography>
										)}
									</Box>
									{user && asset && user._id === asset.owner._id ? (
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
								{asset.owners.length>0 && (
									<Box>
										<Typography
											variant="body2"
											color={"text.secondary"}
											component="p"
										>
											Owner
										</Typography>
										<ListItem
											onClick={() => navigate(`/${asset.owner.username}`)}
											sx={{ cursor: "pointer" }}
										>
											<ListItemAvatar>
												<CircularProfile
													userId={asset.owner._id}
													userImgUrl={asset.owner.displayImage}
												/>
											</ListItemAvatar>
											{user ? (
												<ListItemText
													primary={asset.owner.displayName}
													secondary={`@${
														asset.owner.username.length > 20
															? `${asset.owner.username.substring(
																	0,
																	4
															  )}...${asset.owner.username.slice(-4)}`
															: asset.owner.username
													}`}
												/>
											) : (
												""
											)}
										</ListItem>
									</Box>
								)}
								{asset.events.length === 0 ? (
									<Typography variant="body1">No Activity</Typography>
								) : (
									<Box>
										<ActionsComponent asset={asset} />
										{/* Activity */}
										<Typography variant="h3" component="p">
											Activity
										</Typography>
										<Box className="activityScroll">
											{asset.events.map((e, i) => (
												<Box key={i}>
													<ActivityCardComponent event={e} asset={asset} />
												</Box>
											))}
										</Box>
									</Box>
								)}
							</Box>
						</Stack>
					</Box>
					<br />
					{/* Meta Details */}
					<Stack
						flexDirection={{ xs: "column", md: "row" }}
						justifyContent="space-between"
					>
						{/* Comments */}
						<Box flex={1}>
							<Typography variant="h1">Comments</Typography>
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
															sx={{ cursor: user ? "pointer" : "not-allowed" }}
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
												onChange={(e) => commentOnChange(e.target.value)}
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
										<img width={"75px"} src={NoComment}></img>
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
																	onClick={() => deleteComment(comment._id)}
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
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "start",
								ml: { xs: "0", md: "90px" },
								mt: { xs: "24px", md: "0" },
							}}
							flex={1}
						>
							<Typography variant="h1">Description</Typography>
							<Typography variant="body1">{asset.description}</Typography>
							{/* Meta */}
							<br />
							<br />
							<Typography variant="h1">Details</Typography>
							<Box>
								<Chip
									label="View on Explorer"
									onClick={handleExploreClick}
									icon={<BiLinkExternal />}
									style={{ fontWeight: 600 }}
								/>
							</Box>
						</Box>
					</Stack>
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
			<Box sx={{ margin: { xs: "12px", md: "24px 40px" } }}>
				<CollectionContainer
					title={"More from this Collection"}
					assets={itemFromCollection}
				/>
			</Box>
			<FooterComponent />
		</Box>
	);
}
