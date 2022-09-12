import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const styles = {
	backgroundColor: "#00c775",
	color: "white",
	borderRadius: "8px",
	margin: "0px 16px",
	cursor: "pointer",
};

export function CreateComponent() {
	const navigate = useNavigate();

	return (
		<div>
			<Box
				onClick={(event) => {
					event.preventDefault();
					navigate("/create/select");
				}}
				style={styles}
				sx={{ padding: { xs: "2px 4px", md: "4px 8px" } }}
			>
				<p>Create</p>
			</Box>
		</div>
	);
}
