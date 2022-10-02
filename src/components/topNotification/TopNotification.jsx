import "./topNotification.css";
import { useDispatch, useSelector } from "react-redux";
import {
	clearNotification,
	removeNotification,
} from "../../state/actions/notifications";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
};

export const TopNotification = function () {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [open, setOpen] = useState(false);
	const notifications = useSelector(
		(state) => state.notificationReducer.notifications
	);
	const userData = useSelector((state) => state.authReducer.user);

	useEffect(() => {
		if (userData && userData.is_email_verified) dispatch(clearNotification());
	}, [userData]);

	const handleClose = () => setOpen(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleSubmint = async () => {
		try {
			let token = localStorage.getItem("token");
			let { data } = await axios.post(
				`${process.env.REACT_APP_BASE_URL}/website/v1/email-register`,
				{ email },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			toast(data.message, { type: "success" });
			setOpen(false);
		} catch (error) {
			toast(error.message, { type: "error" });
			setOpen(false);
		}
	};

	return notifications.length === 0 ? (
		""
	) : (
		<div className="top-notification p-6">
			<p className="top-notification-message">
				{notifications[0].message}
				&nbsp;
			</p>
			<p className="top-notification-action" onClick={notifications[0].action}>
				{notifications[0].actionTitle}
			</p>
			<div
				onClick={() => dispatch(removeNotification())}
				className="top-notification-remove"
			>
				<p>X</p>
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Add your email for mail notification
					</Typography>
					<TextField
						id="outlined-basic"
						label="Enter your email"
						variant="outlined"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<div>
						<Button onClick={handleClose}>Close</Button>
						<Button onClick={handleSubmint}>Submit</Button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};
