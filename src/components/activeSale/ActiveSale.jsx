import { Box, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ActivityCardComponent } from "../activityCard/ActivityCard";
import { BiLinkExternal } from "react-icons/bi";
import "./activeBid.css";

export function ActiveSaleComponent({ asset }) {
	console.log(asset);
	const navigate = useNavigate();
	return (
		<Box
			className="activebid-container"
			sx={{
				flexDirection: { xs: "column", md: "column", lg: "row" },
			}}
			onClick={() => navigate(`/asset/${asset._id}`)}
		>
			<Box
				className="activebid-img-container"
				sx={{
					minHeight: "40vh",
					marginRight: { xs: "0", md: "10px" },
					backgroundImage:
						asset.type === "video"
							? "none"
							: `url('${asset.medias.length > 0 ? asset.medias[0].path : ""}')`,
				}}
			></Box>
			<div className="activebid-body">
				{/* Title */}
				<div className="activebid-title">
					<p className="activebid-title-name">{asset.name}</p>
					<p className="activebid-title-id">NFT ID : {asset.item_id}</p>
				</div>
				{/* User */}
				<div className="activebid-user-container">
					<Box
						className="activebid-user-img"
						sx={{
							backgroundImage: `url('${asset.owner.displayImage}')`,
						}}
					></Box>
					<div className="activebid-user-info">
						<p className="activebid-user-info name">
							{asset.owner.displayName}
						</p>
						<p className="activebid-user-info username">
							@
							{asset.owner.username.length > 20
								? `${asset.owner.username.substring(
										0,
										4
								  )}...${asset.owner.username.slice(-4)}`
								: asset.owner.username}
						</p>
					</div>
				</div>
				{/* Data */}
				{/* <div className="activebid-bidder">
					<div className="activebid-bidder-actions container">
						<Chip
							label="View"
							icon={<BiLinkExternal color="white" />}
							sx={{
								fontWeight: 600,
								backgroundColor: "primary.main",
								color: "white",
								cursor: "pointer",
							}}
						/>
					</div>
				</div> */}
				{/* Bids */}
				{/* Bid Title */}
				<div className="activebids-list-container">
					{/* Activity */}
					<Typography variant="h3" component="p">
						Activity
					</Typography>
					<Box>
						{asset.events.slice(0, 2).map((e, i) => (
							<Box key={i}>
								<ActivityCardComponent event={e} asset={asset} />
							</Box>
						))}
					</Box>
				</div>
			</div>
		</Box>
	);
}
