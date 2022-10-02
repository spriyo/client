import { Avatar, Box } from "@mui/material";

export function RectangleProfile({ userImgUrl, userId }) {
	return (
		<Box
			sx={{
				width: 35,
				height: 35,
				cursor: "pointer",
				borderRadius: "8px",
				overflow: "hidden",
			}}
		>
			<img
				src={
					userImgUrl.includes("default-profile-icon")
						? `https://joeschmoe.io/api/v1/${userId}`
						: userImgUrl
				}
				alt="User Profile"
				style={{
					maxWidth: "100%",
					maxHeight: "100%",
					objectFit: "cover",
					overflow: "hidden",
				}}
			/>
		</Box>
	);
}
