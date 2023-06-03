import "./home.css";
import { TbSearch } from "react-icons/tb";
import { NFTHttpService } from "../../api/v2/nft";
import React, { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Box, Chip, Divider, Tooltip, Typography } from "@mui/material";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { TopNotification } from "../../components/topNotification/TopNotification";
import { useNavigate } from "react-router-dom";
import LionForceBanner from "../../assets/lionforce_banner.png";
import LionForceIcon from "../../assets/lionforce_icon.png";
import { RiTwitterLine } from "react-icons/ri";
import axios from "axios";
import { V2_WEB_API_BASE_URL } from "../../constants";
import Web3 from "web3";

export const HomeScreen2 = () => {
	const navigate = useNavigate();
	const nftHttpService = new NFTHttpService();
	const [count, setCount] = useState(0);
	const [input, setInput] = useState("");
	const [statistics, setStatistics] = useState(false);
	const handleKeyDown = (event) => {
		const value = event.target.value;
		if (event.key === "Enter" && value !== "") {
			navigate(`/explore?query=${value}`);
		}
	};

	const onSearch = (event) => {
		if (input !== "") {
			navigate(`/explore?query=${input}`);
		}
	};

	function updateNotification() {
		// Remove in next build
		// dispatch(
		// 	addNotification(
		// 		"We are looking for someone who is good at designing & coding🧑‍💻",
		// 		"Apply Now",
		// 		1,
		// 		() => {
		// 			window.open(
		// 				"https://docs.google.com/forms/d/e/1FAIpQLSe23NtRbi912TFizLU6PedPFh_3gF3Jix-wV2DzrUoL5LzqSA/viewform?usp=sf_link",
		// 				"_blank"
		// 			);
		// 		}
		// 	)
		// );
	}

	async function getStatistics() {
		const response = await axios.get(
			`${V2_WEB_API_BASE_URL}/display/getStatistics`
		);
		setStatistics(response.data);
	}

	useEffect(() => {
		nftHttpService.getTotalNFTCount().then((resp) => {
			setCount(resp.data.count);
		});
		updateNotification();
		getStatistics();
	}, []);

	return (
		<Box>
			<TopNotification />
			{statistics && (
				<Box className="home_stats">
					<div>
						NFT Collection: &nbsp;
						<span>{statistics.total_collections.total_collections}</span>
					</div>
					<div>
						Total Volume: &nbsp;
						<span>
							{Web3.utils.fromWei(
								statistics.total_volume.toLocaleString("fullwide", {
									useGrouping: false,
								})
							)}{" "}
							SHM
						</span>
					</div>
					<div>
						1D Volume: &nbsp;
						<span>
							{Web3.utils.fromWei(statistics.one_day_volume.toString())} SHM
						</span>
					</div>
					<div>
						1D NFT Mint: &nbsp;
						<span>
							{statistics
								? statistics.one_day_mints
									? statistics.one_day_mints.one_day_mints
									: 0
								: 0}
						</span>
					</div>
				</Box>
			)}
			<Divider sx={{ bgcolor: "#161616" }} />
			<div>
				<div>
					<Box sx={{ backgroundColor: "black" }}>
						<Box sx={{ zIndex: 100 }} className="animation-delay">
							<NavbarComponent isHomeScreen={true} />
						</Box>
						{/* Page 1 */}
						{/* Set display to flex to add search back */}
						<Box
							sx={{
								zIndex: 2,
								height: "100vh",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								position: "relative",
							}}
						>
							{/* Animation */}
							<Box className="homepage-background-wrapper">
								<Box className="background-card-wrapper">
									<Box
										sx={{ display: { lg: "block", sm: "none" } }}
										className="background-cards-container"
									>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/9.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/7.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/5.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/28.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/36.png')",
											}}
										></Box>
									</Box>
									<Box
										sx={{ display: { lg: "block", xs: "none", sm: "block" } }}
										className="background-cards-container"
									>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/27.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/26.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/20.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/19.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/24.png')",
											}}
										></Box>
									</Box>
									<Box
										sx={{ display: { lg: "block", xs: "none", sm: "block" } }}
										className="background-cards-container"
									>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/18.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/30.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/16.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/15.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/35.jpg')",
											}}
										></Box>
									</Box>
									<Box
										sx={{ display: { lg: "block", xs: "none", sm: "block" } }}
										className="background-cards-container"
									>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/14.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/13.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/11.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/10.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/26.png')",
											}}
										></Box>
									</Box>
									<Box
										sx={{ display: { lg: "block", xs: "none", sm: "block" } }}
										className="background-cards-container"
									>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/37.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/38.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/39.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/14.png')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/34.jpg')",
											}}
										></Box>
									</Box>
									<Box
										sx={{ display: { lg: "block", sm: "none" } }}
										className="background-cards-container"
									>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/33.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/17.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/31.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/40.jpg')",
											}}
										></Box>
										<Box
											className="homepage-background-card"
											sx={{
												backgroundImage:
													"url('https://rendamarket.s3.ap-south-1.amazonaws.com/hi/29.jpg')",
											}}
										></Box>
									</Box>
								</Box>
							</Box>
							<Box className="homepage-shadow-overlay"></Box>

							<Box
								sx={{
									zIndex: 2,
									display: "flex",
									alignItems: "center",
									flexDirection: "column",
								}}
								className="animation-delay"
							>
								{/* Title */}
								<Typography
									sx={{
										fontSize: { xs: "36px", sm: "48px", md: "80px" },
										fontWeight: "700",
										color: "white",
										mb: "16px",
										lineHeight: "56px",
									}}
								>
									Search Shardeum
								</Typography>
								{/* Subtitle */}
								<Box sx={{ display: "flex", alignItems: "center", mb: "24px" }}>
									<Typography
										sx={{
											fontWeight: "600",
											color: "white",
											fontSize: { xs: "14px", md: "25px" },
										}}
									>
										<span style={{ color: "#00c775" }}>{count}</span> NFTs
										minted on Shardeum Network
									</Typography>
									&nbsp;
									<Tooltip
										componentsProps={{
											tooltip: {
												sx: {
													textAlign: "center",
												},
											},
										}}
										title="NFTs that are minted after 1 November 2022 23:11"
										placement="top"
									>
										<Box display={"flex"} alignItems={"center"}>
											<HiOutlineInformationCircle color="lightgrey" />
										</Box>
									</Tooltip>
								</Box>
								{/* Search Bar */}
								<Box
									sx={{
										width: { xs: "85vw", sm: "70vw", md: "45vw" },
										backgroundColor: "white",
										padding: "18px 4px 18px 24px",
										display: "flex",
										alignItems: "center",
										borderRadius: "28px",
									}}
								>
									<TbSearch
										onClick={onSearch}
										color="grey"
										cursor={"pointer"}
										size={18}
									/>
									<input
										type="search"
										id="search"
										onKeyDown={handleKeyDown}
										placeholder="Search Shradeum..."
										value={input}
										onInput={(e) => setInput(e.target.value)}
										style={{ border: "none", marginLeft: "12px" }}
									/>
								</Box>
								{/* Suggested */}
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										mt: "32px",
										alignItems: "center",
									}}
								>
									<p
										style={{
											color: "white",
											fontSize: "12px",
											marginBottom: "8px",
										}}
									>
										Suggested searches
									</p>
									<Box
										sx={{
											display: "flex",
											padding: "0 16px",
											alignItems: "center",
										}}
									>
										<Chip
											size="small"
											sx={{ color: "white" }}
											label="shm"
											variant="outlined"
											component="a"
											href="explore?query=shm"
											clickable
										/>
										&nbsp; &nbsp;
										<Chip
											size="small"
											sx={{ color: "white" }}
											label="alexey.shm"
											variant="outlined"
											component="a"
											href="explore?query=alexey.shm"
											clickable
										/>
										&nbsp; &nbsp;
										<Chip
											size="small"
											sx={{ color: "white" }}
											label="elon"
											variant="outlined"
											component="a"
											href="explore?query=elon"
											clickable
										/>
										&nbsp; &nbsp;
										<Chip
											size="small"
											sx={{ color: "white" }}
											label="cryptopunks"
											variant="outlined"
											component="a"
											href="explore?query=cryptopunk"
											clickable
										/>
										&nbsp; &nbsp;
										<Chip
											size="small"
											sx={{ color: "white" }}
											label="shardeum"
											variant="outlined"
											component="a"
											href="explore?query=shardeum"
											clickable
										/>
									</Box>
								</Box>
							</Box>
						</Box>

						{/* Mint Page */}
						<Box
							sx={{
								height: "90vh",
								display: "none", // Change to flex
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								// Remove from below
								backgroundColor: "#272727f6" /* Tint color */,
								backgroundImage: `url(${LionForceBanner})`, // Change Image here for future drops
								backgroundBlendMode: "multiply",
							}}
						>
							<Box
								sx={{
									width: "85vw",
									height: "75vh",
									borderRadius: "12px",
									backgroundImage: `url(${LionForceBanner})`,
									backgroundPosition: "center",
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									backgroundColor: "#2e24185b" /* Tint color */,
									backgroundBlendMode: "multiply",
									display: "flex",
									flexDirection: "column",
									justifyContent: "end",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: { xs: "start", md: "end" },
										flexDirection: { xs: "column", md: "row" },
										p: 2,
										color: "white",
									}}
								>
									{/* About */}
									<Box>
										{/* Icon */}
										<Box mb={1}>
											<img
												src={LionForceIcon}
												alt="Drop Icon"
												width="75px"
												style={{
													borderRadius: "10px",
												}}
											/>
										</Box>
										{/* Title */}
										<Box>
											<h1>Lion Force NFT</h1>
										</Box>
										<p>
											By <b>Lion Force</b>
										</p>
									</Box>
									{/* Button */}
									<Box
										sx={{
											borderRadius: "6px",
											border: "2px solid white",
											padding: "10px 8px",
											backgroundColor: "#252525d9",
											cursor: "pointer",
											height: "min-content",
											mt: 2,
										}}
										onClick={() =>
											window.open(
												"https://lionforce-polygon.vercel.app/",
												"_blank"
											)
										}
									>
										<p style={{ fontWeight: "bold", fontSize: "16px" }}>
											Visit Drop
										</p>
									</Box>
								</Box>
							</Box>
						</Box>

						{/* Page 2 */}
						<Box className="homepage-secondscreen-wrapper">
							<Box className="homepage-secondscreen-container">
								<h1>Get, set, launch.</h1>
								<h1>
									Ready to enter the metaverse
									<br /> with digital assets? Publish <br /> your NFTs with a
									single click.
								</h1>
								<Box className="secondscreen-launch-button">
									<h2>Apply for launchpad🚀</h2>
								</Box>
							</Box>
							<p className="homepage-secondscreen-icon a">🌈</p>
							<p className="homepage-secondscreen-icon b">🚀</p>
							<p className="homepage-secondscreen-icon c">🥳</p>
							<p className="homepage-secondscreen-icon d">🦄</p>
						</Box>
						{/* <FooterComponent /> */}
						<Box className="homepage-footer">
							<p>&copy; 2023 Spriyo | &nbsp;</p>
							<p>
								<a
									href="https://twitter.com/spriyomarket"
									target={"_blank"}
									rel="noreferrer"
								>
									<RiTwitterLine />
									@spriyomarket
								</a>
							</p>
						</Box>
					</Box>
				</div>
			</div>
		</Box>
	);
};

// 12,000 NFTs minted on Shardeum Network, Let's F@#$ng Go🔥
