import "./asset.css";
import React, { useState } from "react";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import {
	Avatar,
	Box,
	Chip,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { ButtonComponent } from "../../components/ButtonComponent";
import { FooterComponent } from "../../components/FooterComponent";

export function AssetScreen() {
	const [imageFilled, setImageFilled] = useState(true);

	const TagChip = styled(Chip)({
		margin: "4px",
	});

	return (
		<Box sx={{ backgroundColor: "#efeff8" }}>
			<Box>
				<NavbarComponent />
			</Box>
			<Box sx={{ margin: { xs: "12px", md: "16px 32px" } }}>
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
							onClick={() => setImageFilled(!imageFilled)}
							m={1}
						>
							<img
								src="https://f8n-production-collection-assets.imgix.net/0xE71654E099B44ea1289b95Fa123EE5F1a968ADb9/27/nft.jpg"
								alt="nft"
								width={imageFilled ? "100%" : "none"}
								height="auto"
								className="main-image"
							/>
						</Box>
						{/* Details */}
						<Box flex={1} m={1}>
							<Typography variant="h1">Storm NFT</Typography>
							<Typography
								variant="subtitle2"
								color={"text.secondary"}
								component="p"
							>
								NFT ID : 5643
							</Typography>
							<Typography
								variant="body2"
								color={"text.secondary"}
								component="p"
							>
								Owner
							</Typography>
							<ListItem>
								<ListItemAvatar>
									<Avatar src=""></Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Leo Stelon"
									secondary="10 JUL 2021, 09:18 PM"
								/>
							</ListItem>
							{/* Timing */}
							<ListItem
								secondaryAction={
									<ButtonComponent
										rounded={true}
										filled={true}
										text="Place Bid"
									/>
								}
							>
								<ListItemText
									primary="Ending in"
									secondary="02h 23m 23s"
									secondaryTypographyProps={{
										fontSize: 20,
										fontWeight: 600,
										color: "text.primary",
									}}
								/>
							</ListItem>
							{/* Current Bidder */}
							<Typography variant="h6">Current Bid</Typography>
							<ListItem>
								<ListItemAvatar>
									<Avatar src=""></Avatar>
								</ListItemAvatar>
								<ListItemText primary="John Doe" secondary="@john" />
							</ListItem>
							{/* Bid History */}
							<Typography variant="h3" component="p">
								Bid History
							</Typography>
							<Box>
								<Box>
									<ListItem
										secondaryAction={
											<Stack direction={"row"}>
												<Typography variant="h6">0.3 ETH</Typography>
												<Typography variant="h6" color={"text.secondary"}>
													&nbsp;= Rs 3000
												</Typography>
											</Stack>
										}
									>
										<ListItemAvatar>
											<Avatar src=""></Avatar>
										</ListItemAvatar>
										<ListItemText primary="John Doe" secondary="@john" />
									</ListItem>

									<ListItem
										secondaryAction={
											<Stack direction={"row"}>
												<Typography variant="h6">0.3 ETH</Typography>
												<Typography variant="h6" color={"text.secondary"}>
													&nbsp;= Rs 3000
												</Typography>
											</Stack>
										}
									>
										<ListItemAvatar>
											<Avatar src=""></Avatar>
										</ListItemAvatar>
										<ListItemText primary="John Doe" secondary="@john" />
									</ListItem>
								</Box>
							</Box>
						</Box>
					</Stack>
				</Box>
				<br />
				{/* Meta Details */}
				<Box>
					<Typography variant="h1">Description</Typography>
					<Typography variant="body1">
						BearX is a limited NFT collection of Genesis and Mini Bears created
						on Ethereum blockchain. After being banished from their own land,
						only some Bears survived.
					</Typography>
					<br />
					<Typography variant="h1">Tags</Typography>
					<TagChip label="Meta"></TagChip>
					<TagChip label="Metaverse"></TagChip>
					<TagChip label="Drawing"></TagChip>
					<TagChip label="Painting"></TagChip>
					<TagChip label="Pencil"></TagChip>
				</Box>
			</Box>
			<FooterComponent />
		</Box>
	);
}
