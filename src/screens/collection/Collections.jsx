import { Box, Grid, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CollectionHttpService } from "../../api/v2/collection";
import { FooterComponent } from "../../components/FooterComponent";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";

export const Collections = () => {
	const navigate = useNavigate();
	const collectionHttpService = new CollectionHttpService();
	const skip = useRef(0);

	const [collections, setCollections] = useState([]);

	async function getCollections() {
		try {
			const resolved = await collectionHttpService.getCollections({
				user_address: "",
				skip: skip.current,
			});
			if (!resolved.error) {
				setCollections((s) => [...s, ...resolved.data]);
				skip.current += 10;
			}
		} catch (error) {
			console.log(error);
			toast(error.message, { type: "error" });
		}
	}

	useEffect(() => {
		getCollections();
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
					alignItems: "center",
					p: 2,
				}}
			>
				<Typography variant="h1" sx={{ fontSize: "30px" }}>
					Explore Collections
				</Typography>
				<br />
				<Box>
					<InfiniteScroll
						dataLength={collections.length}
						next={getCollections}
						hasMore={true}
						loader={<p></p>}
						style={{ overflowY: "clip" }}
					>
						<Grid
							container
							spacing={{ xs: 2, md: 3 }}
							columns={{ xs: 4, sm: 8, md: 12 }}
						>
							{collections.map((collection, index) => (
								<Grid item xs={12} sm={4} md={4} key={index}>
									<Box
										onClick={() => navigate(`/collections/${collection.uname}`)}
									>
										<Box>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													flexDirection: "column",
													position: "relative",
													marginBottom: "50px",
													minWidth: "350px",
												}}
											>
												<Box
													style={{
														backgroundImage: `url(${collection.banner_image}`,
														height: "25vh",
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
														width: "80px",
														height: "80px",
														bottom: "-44px",
														left: "14px",
														position: "absolute",
														borderRadius: "10px",
														backgroundImage: `url(${collection.image})`,
													}}
												></Box>
											</Box>
										</Box>
										<Box>
											{collection.name && (
												<Typography variant="h2">{collection.name}</Typography>
											)}
											{collection.owners && (
												<Typography
													variant="h3"
													fontWeight="normal"
													mb={1}
													onClick={() =>
														navigate(`/${collection.owners[0].username}`)
													}
													sx={{ cursor: "pointer" }}
												>
													by&nbsp;
													<span style={{ fontWeight: "bold" }}>
														@{collection.owners[0].username}
													</span>
												</Typography>
											)}
											{collection.description && (
												<Typography
													variant="h3"
													fontWeight="normal"
													sx={{
														maxLines: 1,
														clear: "both",
														display: "inline-block",
														overflow: "hidden",
														whiteSpace: "nowrap",
														textOverflow: "ellipsis",
														maxWidth: "350px",
													}}
												>
													{collection.description}
												</Typography>
											)}
										</Box>
										&nbsp;
										<Box
											onClick={() =>
												navigate(`/${collection.owners[0].username}`)
											}
											text="Create"
											sx={{
												backgroundColor: "#00e285",
												borderRadius: "8px",
												padding: "6px 10px",
												color: "black",
												border: "none",
												fontWeight: "600",
												textAlign: "center",
												cursor: "pointer",
											}}
										>
											Explore
										</Box>
									</Box>
								</Grid>
							))}
						</Grid>
					</InfiniteScroll>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
};
