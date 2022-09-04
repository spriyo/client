import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BoxShadow } from "../../../components/BoxShadow";
import { FooterComponent } from "../../../components/FooterComponent";
import { NavbarComponent } from "../../../components/navBar/NavbarComponent";

export const SelectCreate = () => {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				justifyContent: "start",
			}}
		>
			<NavbarComponent />
			<Box
				sx={{
					flexGrow: 1,
					minHeight: "55vh",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Typography variant="h1">Choose Type</Typography>
				<br />
				<Stack
					sx={{
						textAlign: "center",
						flexDirection: { xs: "column", md: "row" },
					}}
				>
					<Box
						sx={{
							flex: 1,
							m: { md: 0, xs: 1 },
							ml: { md: 5, xs: 0 },
							mr: { md: 1, xs: 0 },
						}}
					>
						<BoxShadow>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									p: 3,
									border: "1px solid #e8e8e8",
									borderRadius: "8px",
								}}
								onClick={() => navigate("/create")}
							>
								<Typography variant="h2">Single</Typography>
								&nbsp;
								<Typography variant="h5" color="text.primary">
									Can be used to express unique items,{" "}
									<pre>only one item per token ID.</pre>
								</Typography>
							</Box>
						</BoxShadow>
					</Box>
					<Box
						sx={{
							flex: 1,
							m: { md: 0, xs: 1 },
							mr: { md: 5, xs: 0 },
							ml: { md: 1, xs: 0 },
						}}
					>
						<BoxShadow>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									p: 3,
									border: "1px solid #e8e8e8",
									borderRadius: "8px",
								}}
								onClick={() => navigate("/create/multiple")}
							>
								<Typography variant="h2">Multiple</Typography>
								&nbsp;
								<Typography variant="h5" color="text.primary">
									Can have have multiple copies for the same token ID, and can
									be distributed separately.
								</Typography>
							</Box>
						</BoxShadow>
					</Box>
				</Stack>
			</Box>
			<FooterComponent />
		</Box>
	);
};
