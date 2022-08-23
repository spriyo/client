import { Box } from "@mui/material";
import React from "react";

export const ButtonComponent = ({ onClick, text = "Button" }) => {
	return (
		<Box
			onClick={onClick}
			borderRadius={"14px"}
			padding={"8px"}
			m={1}
			border={"1px solid #d9d9d9"}
			sx={{
				cursor: "pointer",
				"&:hover": {
					backgroundColor: "#f7f7f7",
				},
			}}
			fontWeight={"600"}
		>
			{text}
		</Box>
	);
};
