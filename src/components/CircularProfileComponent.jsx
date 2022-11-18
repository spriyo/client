import { Avatar, Box } from "@mui/material";

export function CircularProfile({ userImgUrl, userId }) {
	return (
		<Box>
			<Avatar
				src={
					userImgUrl.includes("default-profile-icon")
						? `https://joeschmoe.io/api/v1/${userId}`
						: userImgUrl
				}
				alt="User Profile"
				sx={{ width: 35, height: 35, cursor: "pointer" }}
			/>
		</Box>
	);
}