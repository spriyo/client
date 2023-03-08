import { Avatar, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { LikeHttpService } from "../../api/like";
import { DOTSHM_ADDRESS } from "../../constants";
import DOTSHM_IMAGE from "../../assets/dotshm.png";
import LOADING_IMG from "../../assets/loading-image.gif";
import "./card.css";

export function CardComponent({ asset }) {
	const likeHttpService = new LikeHttpService();
	const [liked, setLiked] = useState(false);

	async function handleLike(e) {
		e.stopPropagation();
		const id = asset._id;
		if (liked) {
			await likeHttpService.unLikeAsset(id);
			setLiked(false);
		} else {
			await likeHttpService.likeAsset(id);
			setLiked(true);
		}
	}

	function getMethodName(events) {
		if (!events || events.length === 0) return "";
		switch (asset.events[0].method) {
			case "0x68656c6c":
				return "Transfered";
			default:
				return "";
		}
	}

	useEffect(() => {
		setLiked(asset.liked);

		return () => {
			return asset.liked;
		};
	}, [asset.liked]);

	return (
		<Box
			className="card-container"
			position="relative"
			style={{
				backgroundImage:
					asset.image && asset.image.includes(".mp4")
						? "none"
						: `url('${
								asset.contract_address === DOTSHM_ADDRESS
									? DOTSHM_IMAGE
									: asset.image || LOADING_IMG
						  }')`,
			}}
		>
			{asset.image && asset.image.includes(".mp4") ? (
				<video className="video-component" autoPlay muted loop>
					<source src={asset.image} type="video/mp4" />
				</video>
			) : (
				<div></div>
			)}
			{"liked" in asset ? (
				<Box position={"absolute"} top={8} right={8} onClick={handleLike}>
					<Avatar
						sx={{
							backgroundColor: "rgba(0, 0, 0, 0.05)",
							width: 30,
							height: 30,
							"&:hover": {
								backgroundColor: "rgba(0, 0, 0, 0.1)",
							},
						}}
					>
						{liked ? (
							<AiFillHeart size={20} color="rgb(255, 87, 87)" />
						) : (
							<AiOutlineHeart size={20} color="rgba(0, 0, 0, 0.5)" />
						)}
					</Avatar>
				</Box>
			) : (
				""
			)}
			<div className="card-info">
				{asset.owners.length > 0 && asset.owners[0].user && (
					<div
						className="card-info-profileimg"
						style={{
							backgroundImage: `url('${
								asset.owners[0].user.displayImage.includes(
									"default-profile-icon"
								)
									? `https://joeschmoe.io/api/v1/${asset.owners[0].user._id}`
									: asset.owners[0].user.displayImage
							}')`,
						}}
					></div>
				)}
				<div className="card-info-top">
					{/* title */}
					<div className="card-info-title">
						<p>
							{asset.contract_address === DOTSHM_ADDRESS
								? asset.metadata_url
								: asset.name === ""
								? asset.token_id.substring(0, 15)
								: asset.name}
						</p>
						<p style={{ fontSize: "10px" }}>
							#{asset.token_id.substring(0, 10)}
						</p>
					</div>
					<Typography variant="h6">
						{/* {asset.created_by && `Created : @${asset.created_by.displayName}`} */}
						{asset.type}
						{`(${asset.chain_id === "8080" ? "Lib 1.x" : "Lib 2.0"})`}
					</Typography>
				</div>
				<div className="card-info-bottom">
					{/* Event */}
					<div className="card-info-price">
						<p>{getMethodName(asset.events)}</p>
					</div>
					{/* price
					<div className="card-info-price">
						<p>
							Price <span>6 WRX($ 1234)</span>
						</p>
					</div> */}
					{/* button */}
					{/* <div className="card-info-action">
						<p>Buy now</p>
					</div> */}
				</div>
			</div>
		</Box>
	);
}
