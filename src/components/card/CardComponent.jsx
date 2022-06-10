import { Avatar, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { LikeHttpService } from "../../api/like";
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
					asset.type === "video"
						? "none"
						: `url('${
								asset.image ||
								(asset.medias.length !== 0 ? asset.medias[0].path : "")
						  }')`,
			}}
		>
			{asset.type === "video" ? (
				<video className="video-component" autoPlay muted loop>
					<source src={asset.medias[0].path} type="video/mp4" />
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
				<div
					className="card-info-profileimg"
					style={{
						backgroundImage: `url('${
							asset.owner.displayImage.includes("default-profile-icon")
								? `https://joeschmoe.io/api/v1/${asset.owner._id}`
								: asset.owner.displayImage
						}')`,
					}}
				></div>
				<div className="card-info-creator">
					{/* created by */}
					<p>
						{asset.created_by && `Created : @${asset.created_by.displayName}`}
					</p>
				</div>
				<div className="card-info-top">
					{/* title */}
					<div className="card-info-title">
						<p>{asset.name}</p>
					</div>
				</div>
				<div className="card-info-bottom">
					{/* Event */}
					<div className="card-info-price">
						<p>
							{asset.events
								? asset.events.length === 0
									? "" // no events
									: asset.events[0].event_type.replace("_", " ").toUpperCase()
								: "Events Not present"}
						</p>
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
