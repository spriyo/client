import React from "react";
import { Box } from "@mui/material";

export const BoxShadow = (props) => {
	return (
		<Box
			sx={{
				boxShadow: "rgba(149, 157, 165, 0.2) 0px 4px 24px",
				margin: "4px 0",
				border: "1px solid #ebebeb",
				borderRadius: "8px",
				cursor: "pointer",
				"&:hover": {
					transform: " scale(1.001)",
					boxShadow: "rgba(149, 157, 165, 0.3) 0px 4px 24px",
				},
			}}
		>
			{props.children}
		</Box>
	);
};
