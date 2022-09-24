import {
	Box,
	Card,
	CardHeader,
	Avatar,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { NotificationHttpService } from "../api/notification";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const NotificationScreen = () => {
	const notificationHttpService = new NotificationHttpService();
	const [notificationList, setNotificationList] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		getNotification();
	}, []);

	const getNotification = async () => {
		try {
			let {
				data: { data },
			} = await notificationHttpService.getNotificationList();
			setNotificationList(data);
			setLoading(false);
		} catch (error) {
			toast.warn(error.message);
		}
	};

	return (
		<Box>
			<NavbarComponent />
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					width: "100%",
					paddingBottom: "16px",
				}}
			>
				<Box>
					<h1 style={{ textAlign: "center" }}>Notifications</h1>
				</Box>

				{notificationList.length > 0 ? (
					notificationList.map((ele, i) => {
						return (
							<Box
								style={{
									padding: "4px",
									display: "flex",
									justifyContent: "center",
								}}
								key={i}
							>
								<Card
									sx={{
										boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
										minWidth: { xs: "80vw", sm: "60vw", md: "50vw" },
										maxWidth: { xs: "80vw", sm: "60vw", md: "50vw" },
										border: "1px solid #a4a4a433",
										cursor: ele.url ? "pointer" : "default",
										backgroundColor: ele.read ? "white" : "#d8d8d8",
										"&:hover": {
											backgroundColor: "#d5d5d533",
										},
									}}
									onClick={() => {
										if (ele.url) navigate(ele.url);
									}}
								>
									<CardHeader
										avatar={
											<Avatar
												sx={{ bgcolor: "palette.primary" }}
												aria-label="recipe"
											>
												N
											</Avatar>
										}
										title={<Typography variant="h5">{ele.title}</Typography>}
										subheader={
											<Box>
												<p style={{ color: "black" }}>{ele.description}</p>
												<p style={{ color: "text.primary", fontSize: "10px" }}>
													{new Date(ele.createdAt).toDateString()}
												</p>
											</Box>
										}
									/>
								</Card>
							</Box>
						);
					})
				) : (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							width: "100%",
							padding: "32px",
						}}
					>
						{
							<h2 style={{ textAlign: "center" }}>
								{loading ? "Loading..." : "No notifications📥"}
							</h2>
						}
					</Box>
				)}
			</Box>
			<FooterComponent />
		</Box>
	);
};
