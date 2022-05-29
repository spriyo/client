import { Avatar, Box } from "@mui/material";

export function CircularProfile({ userImgUrl }) {
	return (
		<Box>
			<Avatar src={userImgUrl} alt="User Profile" />
		</Box>
	);
}
