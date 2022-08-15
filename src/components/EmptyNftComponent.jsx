import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmptyGif from "../lottie/empty.gif";

export const EmptyNftComponent = ({ currentUser = false }) => {
	const navigate = useNavigate();

	return (
		<Box display={"flex"} flexDirection={"column"} alignItems="center">
			<img src={EmptyGif} alt="Empty" style={{ height: "40vh" }} />
			<Box m={2} textAlign={"center"}>
				<Box>
					<Typography variant="h3">
						{currentUser ? "You don't own any NFTs" : "Explore NFTs"}
					</Typography>
				</Box>
				<Box sx={{ cursor: "pointer" }} onClick={() => navigate("/explore")}>
					<Typography variant="h5" color={"blue"}>
						Explore
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};
