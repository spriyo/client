import "./navBar.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ConnectComponent } from "../ConnectComponent";
import { Box, Menu, Stack } from "@mui/material";
import logo from "../../assets/spriyo.png";
import DiscordLogo from "../../assets/discord-logo.png";
import { useEffect, useState } from "react";
import { RiNotification3Line } from "react-icons/ri";
import { NotificationHttpService } from "../../api/notification";
import { RectangleProfile } from "../RectangleProfile";
import { MdOutlineExplore } from "react-icons/md";
import { TbSearch } from "react-icons/tb";

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
		<Box
			sx={{
				backgroundColor: "rgba(255, 255, 255, 0.75)",
				padding: { xs: "9px 14px", md: "9px 45px" },
				height: "auto",
				backdropFilter: "blur(10px)",
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
					{/* search */}
				</Box>
				{/* <Box sx={{ display: { xs: "none", md: "block" }, ml: "24px" }}>
					<SearchComponent />
				</Box> */}
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
							<RiNotification3Line size={20} color="#505050" />
						</Box>
					</Box>
				)}
				<Box onClick={() => navigate("/explore")} sx={IconButtonStyle}>
					<TbSearch size={20} color="#505050" />
				</Box>
				<Box onClick={() => navigate("/explore")} sx={IconButtonStyle}>
					<MdOutlineExplore size={20} color="#505050" />
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
						<Box sx={{ backgroundColor: "background.default" }}>
							<Box m={1} p={1}>
								<NavListItem title="Home" to="/" />
							</Box>
							<Box
								m={1}
								p={1}
								onClick={() => {
									window.open("https://discord.gg/pY3p7UNDd6", "_blank");
								}}
							>
								<Stack direction={"row"}>
									<img
										src={DiscordLogo}
										height={"20px"}
										width={"auto"}
										alt="Discord Logo"
									/>
									<NavListItem title="Discord" />
								</Stack>
							</Box>
							<Box m={1} p={1}>
								<NavListItem title="Explore" to="/explore" />
							</Box>
							<Box m={1} p={1}>
								<NavListItem title="Favorites" to="/favorites" />
							</Box>
							<Box m={1} p={1}>
								<NavListItem title="Import" to="/import" />
							</Box>
							<Box m={1} p={1}>
								<NavListItem title="Create" to="/create/select" />
							</Box>
						</Box>
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
	);
}

export const NavListItem = ({ title = "title", to }) => {
	const location = useLocation();
	const navigate = useNavigate();
	function handleClick() {
		if (to) {
			navigate(to);
		}
	}

	const style = {
		color: location.pathname === to ? "primary.main" : "text.primary",
		fontWeight: "500",
		"&:hover": {
			color: "primary.main",
			cursor: "pointer",
		},
	};
	return (
		<Box onClick={handleClick} sx={style} pr={2} pl={2}>
			<p>{title}</p>
		</Box>
	);
};
