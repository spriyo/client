import { Box } from "@mui/material";
import React from "react";

export const ButtonComponent = ({
	onClick,
	rounded = false,
	filled = false,
	text = "Button",
}) => {
	return (
		<Box
			onClick={onClick}
			borderRadius={rounded ? "20px" : "4px"}
			bgcolor={filled ? "primary.main" : "none"}
			boxShadow={"0"}
			color={filled ? "text.secondry" : "text.primary"}
			p={1}
			pl={2}
			pr={2}
			border={filled ? "none" : "1px solid #c4c4c4"}
			sx={{ cursor: "pointer" }}
		>
			{text}
		</Box>
	);
};
