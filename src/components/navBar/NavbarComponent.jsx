import "./navBar.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ConnectComponent } from "../ConnectComponent";
import { Box, Menu } from "@mui/material";
import logo from "../../assets/spriyo light.png";
import { useEffect, useState } from "react";
import { RiNotification3Line } from "react-icons/ri";
import { NotificationHttpService } from "../../api/notification";
import { RectangleProfile } from "../RectangleProfile";
import { MdOutlineExplore } from "react-icons/md";
import { BsCollection } from "react-icons/bs";

export function NavbarComponent() {
	const authenticated = useSelector((state) => state.authReducer.authenticated);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [notificationCount, setNotificationCount] = useState(0);
	const notificationHttpService = new NotificationHttpService();
	const IconButtonStyle = {
		width: 35,
		height: 35,
		border: "1px solid #c6c6c6",
		cursor: "pointer",
		borderRadius: "8px",
		display: "flex",
		alignItems: "center",
		justifyContent: "Center",
		mx: 0.5,
	};

	async function getNotificationCount() {
		try {
			const resolved = await notificationHttpService.getNotitficationCount();
			if (!resolved.error) {
				setNotificationCount(resolved.data.count);
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		getNotificationCount();
		return () => {};
	}, []);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				backgroundColor: "rgb(0, 0, 0)",
			}}
			className="navbar-wrapper"
		>
			<Box
				sx={{
					padding: { xs: "9px 14px", md: "9px 45px" },
					height: "auto",
					backdropFilter: "blur(10px)",
					width: "100%",
					maxWidth: "1400px",
				}}
				className="navbar-container"
			>
				<Box display="flex">
					<Box
						display="flex"
						alignItems="start"
						style={{ cursor: "pointer" }}
						onClick={() => navigate("/")}
					>
						<img src={logo} alt="logo" height={36} />
						<small>beta</small>
					</Box>
					{/* search */}
					<Box sx={{ display: { xs: "none", md: "block" }, ml: "24px" }}>
						{/* <SearchComponent /> */}
					</Box>
				</Box>
				<div className="navbar-actions">
					{authenticated && (
						<Box
							style={{ position: "relative" }}
							onClick={() => navigate("/notifications")}
						>
							<Box className="notification-count">
								{notificationCount > 9 ? "9+" : notificationCount}
							</Box>
							<Box sx={IconButtonStyle}>
								<RiNotification3Line size={20} color="white" />
							</Box>
						</Box>
					)}
					<Box onClick={() => navigate("/collections")} sx={IconButtonStyle}>
						<BsCollection size={20} color="white" />
					</Box>
					<Box onClick={() => navigate("/explore")} sx={IconButtonStyle}>
						<MdOutlineExplore size={20} color="white" />
					</Box>
					{authenticated ? (
						<Box
							mr={1}
							ml={1}
							sx={{ cursor: "pointer", display: { xs: "none", md: "block" } }}
						>
							<Box
								onClick={() => navigate("/create/select")}
								text="Create"
								sx={{
									backgroundColor: "#00e285",
									borderRadius: "8px",
									padding: "6px 10px",
									color: "black",
									border: "none",
									fontWeight: "600",
								}}
							>
								Create 🌈
							</Box>
						</Box>
					) : (
						<div></div>
					)}
					{/* profile */}
					<Box>
						<Menu
							id="menu"
							aria-labelledby="nav-button"
							anchorEl={anchorEl}
							open={open}
							onClose={handleClose}
							anchorOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
						>
							<Box sx={{ backgroundColor: "background.default" }}></Box>
						</Menu>
					</Box>

					{authenticated ? (
						<Box onClick={() => navigate(`/${user.username}`)} m={1}>
							<RectangleProfile
								userImgUrl={user.displayImage}
								userId={user._id}
							/>
						</Box>
					) : (
						<Box>
							<ConnectComponent />
						</Box>
					)}
				</div>
			</Box>
		</div>
	);
}
