import {
	Box,
	Divider,
	Card,
	CardHeader,
	Avatar,
	IconButton,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { NotificationHttpService } from "../api/notification";

export const NotificationScreen = () => {
	const notificationHttpService = new NotificationHttpService();
	const [notificationList, setNotificationList] = useState([]);

	useEffect(() => {
		getNotification();
	}, []);

	const getNotification = async () => {
		let {
			data: { data },
		} = await notificationHttpService.getNotitficationList();
		console.log("getnotification", data);
		setNotificationList(data);
	};

	const updateNotification = async (id, is_read) => {
		let payload =
			is_read === true
				? {
						read: true,
				  }
				: { trash: true };
		let data = await notificationHttpService.updateNotitfication(id, payload);
		console.log("update data", data);
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
									padding: "10px",
									display: "flex",
									justifyContent: "center",
								}}
								key={i}
							>
								<Card
									sx={{
										boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
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
										action={
											<IconButton
												aria-label="settings"
												style={{
													color: "white",
													cursor: "pointer",
													fontSize: "1em",
												}}
												onClick={() => updateNotification(ele._id, true)}
											>
												View
											</IconButton>
										}
									/>
								</Card>
							</Box>
						);
					})
				) : (
					<h1>No notifications📥</h1>
				)}
			</Box>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
