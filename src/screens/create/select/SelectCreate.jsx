import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BoxShadow } from "../../../components/BoxShadow";
import { FooterComponent } from "../../../components/FooterComponent";
import { NavbarComponent } from "../../../components/navBar/NavbarComponent";

import multi from "../../../assets/multi.png";
import single from "../../../assets/single.png";

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
							ml: { md: 5, xs: 3 },
							mr: { md: 1, xs: 3 },
						}}
					>
						<BoxShadow>
							<Stack
								sx={{
									textAlign: { xs: "start", md: "center" },
									alignItems: "center",
									flexDirection: { md: "column", xs: "row" },
									p: 3,
									border: "1px solid #e8e8e8",
									borderRadius: "8px",
								}}
								onClick={() => navigate("/create")}
							>
								<img src={single} alt="single" height="90px" width="90px" />
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: { xs: "start", md: "center" },
										width: "100%",
										px: 2,
									}}
								>
									<Typography variant="h2" sx={{ my: 1 }}>
										Single
									</Typography>

									<Typography variant="h5" color="text.primary">
										Can be used to express unique items,{" "}
										<pre>only one item per token ID.</pre>
									</Typography>
								</Box>
							</Stack>
						</BoxShadow>
					</Box>
					<Box
						sx={{
							flex: 1,
							m: { md: 0, xs: 1 },
							ml: { md: 5, xs: 3 },
							mr: { md: 1, xs: 3 },
						}}
					>
						<BoxShadow>
							<Stack
								onClick={() => navigate("/create/multiple")}
								sx={{
									textAlign: { xs: "start", md: "center" },
									alignItems: "center",
									flexDirection: { md: "column", xs: "row" },
									p: 3,
									border: "1px solid #e8e8e8",
									borderRadius: "8px",
								}}
							>
								<img src={multi} alt="multi" height="90px" width="90px" />
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: { xs: "start", md: "center" },
										width: "100%",
										px: 2,
									}}
								>
									<Typography variant="h2" sx={{ my: 1 }}>
										Multiple
									</Typography>

									<Typography variant="h5" color="text.primary">
										Can have have multiple copies for the same token ID, and can
										be distributed separately.
									</Typography>
								</Box>
							</Stack>
						</BoxShadow>
					</Box>
				</Stack>
			</Box>
			<FooterComponent />
		</Box>
	);
};
