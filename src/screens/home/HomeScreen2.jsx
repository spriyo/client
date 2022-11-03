import "./home.css";
import { TbSearch } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { NFTHttpService } from "../../api/v2/nft";
import React, { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { addNotification } from "../../state/actions/notifications";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { TopNotification } from "../../components/topNotification/TopNotification";
import { useNavigate } from "react-router-dom";

export const HomeScreen2 = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const nftHttpService = new NFTHttpService();
	const [count, setCount] = useState(0);
	const [input, setInput] = useState("");
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
		dispatch(
			addNotification(
				"We are looking for someone who is good at designing & coding🧑‍💻",
				"Apply Now",
				1,
				() => {
					window.open(
						"https://docs.google.com/forms/d/e/1FAIpQLSe23NtRbi912TFizLU6PedPFh_3gF3Jix-wV2DzrUoL5LzqSA/viewform?usp=sf_link",
						"_blank"
					);
				}
			)
		);
	}

	useEffect(() => {
		nftHttpService.getTotalNFTCount().then((resp) => {
			setCount(resp.data.count);
		});
		updateNotification();
	}, []);

	return (
		<Box>
			<TopNotification />
			<div>
				<div className="navbar">
					<Box
						sx={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1633783156075-a01661455344?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80')",
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							backgroundColor: "#3b28147f" /* Tint color */,
							backgroundBlendMode: "multiply",
						}}
					>
						<NavbarComponent />
						<Box
							sx={{
								height: "90vh",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								flexDirection: "column",
								position: "relative",
							}}
						>
							{/* Title */}
							<Typography
								sx={{
									fontSize: { xs: "36px", sm: "48px", md: "56px" },
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
										fontWeight: "500",
										color: "white",
										fontSize: { xs: "14px", md: "18px" },
									}}
								>
									<span style={{ color: "#00c775" }}>{count}</span> NFTs minted
									on Shardeum Network
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
								<Box>
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

							{/* Unsplash */}
							<Box
								sx={{
									backgroundColor: "#f5f5f5",
									borderRadius: "4px",
									display: "flex",
									padding: "6px 24px 6px 10px",
									position: "absolute",
									bottom: 16,
									left: 16,
									fontSize: "10px",
								}}
							>
								Photo by&nbsp;
								<a
									style={{ color: "grey" }}
									href="https://unsplash.com/@mo_motorious?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
								>
									Mo
								</a>
								&nbsp; on&nbsp;
								<a
									style={{ color: "grey" }}
									href="https://unsplash.com/s/photos/render?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
								>
									Unsplash
								</a>
							</Box>
						</Box>
					</Box>
				</div>
			</div>
		</Box>
	);
};

// 12,000 NFTs minted on Shardeum Network, Let's F@#$ng Go🔥
