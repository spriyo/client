import { Box } from "@mui/material";
import { ChatComponent } from "../chat/ChatComponent";
import "./highlights.css";

export function HighlightsComponent({ title, data = [] }) {
	return (
		<div className="highlights-container">
			<div className="highlights-title">
				<p>{title}</p>
			</div>
			<Box sx={{ height: "50vh" }}>
				<ChatComponent />
			</Box>
			{/* {data.length > 1 ? (
				<div className="collection-action">See all</div>
			) : (
				<div></div>
			)} */}
		</div>
	);
}
