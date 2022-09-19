import "./navBar.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchComponent } from "../search/SearchComponent";
import { ButtonComponent } from "../ButtonComponent";
import { ConnectComponent } from "../ConnectComponent";
import { CircularProfile } from "../CircularProfileComponent";
import { Avatar, Box, Grid, Menu, Stack, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

import logo from "../../assets/spriyo.png";
import DiscordLogo from "../../assets/discord-logo.png";
import { IoIosMore } from "react-icons/io";
import { MdOutlineNotificationsActive, MdExpandMore } from "react-icons/md";
import { useState } from "react";
import { NotificationHttpService } from "../../api/notification";
import { useEffect } from "react";


export function NavbarComponent() {
	const notificationHttpService = new NotificationHttpService();
	const authenticated = useSelector((state) => state.authReducer.authenticated);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();
	const [anchorElNotification, setAnchorElNotification] = useState(null);
	const openNotification = Boolean(anchorElNotification)
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [notificationList, setNotificationList] = useState([]);

	useEffect(() => {
		getNotification();
	}, [])

	const getNotification = async () => {
		let data = await notificationHttpService.getNotitficationList();
		console.log('getnotification', data)
		setNotificationList(data);
	}

	const updateNotification = async(id, is_read) => {
		let payload = is_read === true ? {
			read: true
		} : { trash: true}
		let data = await notificationHttpService.updateNotitfication(id, payload);
		console.log('update data', data)
	}

	const handleCloseNotification = () => {
		setAnchorElNotification(null);
	  };

	const handleNotification = (event) => {
		console.log('***', Boolean(anchorElNotification))
		setAnchorElNotification(event.currentTarget);
	}

	

	return (
		<Box
			sx={{
				backgroundColor: "background.default",
				padding: { xs: "9px 14px", md: "9px 45px" },
				height: "auto",
			}}
			className="navbar-container"
		>
			<Box
				display="flex"
				alignItems="start"
				style={{ cursor: "pointer" }}
				onClick={() => navigate("/")}
			>
				<img src={logo} alt="logo" height={36} />
				<small>beta</small>
			</Box>
			<div className="navbar-actions">
				{/* search */}
				<Box sx={{ display: { xs: "none", md: "block" } }}>
					<SearchComponent />
				</Box>
				{authenticated ? (
					<Box
						mr={1}
						ml={1}
						sx={{ cursor: "pointer", display: { xs: "none", md: "block" } }}
					>
						<Grid spacing={2}>
							<Grid xs={8}>
						<ButtonComponent
							onClick={(event) => {
								event.preventDefault();
								navigate("/create/select");
							}}
							text="Create"
							rounded={true}
							filled={true}
						/>
						</Grid>
						<Grid xs={4}>
						<Button
						id="basic-button"
						aria-controls={openNotification ? 'basic-menu' : undefined}
						aria-haspopup="true"
						aria-expanded={openNotification ? 'true' : undefined}
						onClick={handleNotification}
							>
								Notification
							</Button>
						{/* <MdOutlineNotificationsActive id="basic-button" aria-expanded={openNotification ? 'true' : undefined} aria-controls={openNotification ? 'basic-menu' : undefined} onClick={handleNotification} /> */}
						{openNotification ? (
							<Menu
							id="basic-menu"
							anchorEl={anchorElNotification}
							open={openNotification}
							onClose={handleCloseNotification}
							MenuListProps={{
							  'aria-labelledby': 'basic-button',
							}}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'left',
							  }}
							  transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							  }}
						  >
							 {notificationList.length > 0 && notificationList.map((ele, i) => {
									return (<Accordion key={i}>
									<AccordionSummary
									expandIcon={<MdExpandMore />}
									aria-controls="panel1a-content"
									id="panel1a-header"
									>
									<Typography>{ele.title}</Typography>
									</AccordionSummary>
									<AccordionDetails>
									<Typography>
										{ele.description} - {ele.createdAt}
										<Button onClick={() => updateNotification(ele._id, true)} >read</Button> <Button onClick={() => updateNotification(ele._id, false)}>clear</Button>
									</Typography>
									</AccordionDetails>
									</Accordion>)
							 }) }
						  </Menu>
							) : null}
						</Grid>
						</Grid>
					</Box>
				) : (
					<div><MdOutlineNotificationsActive /></div>
				)}
				{/* profile */}
				<Box sx={{ display: { xs: "block", md: "none" } }}>
					<Avatar
						onClick={handleClick}
						aria-controls={open ? "menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						id="nav-button"
						sx={{
							width: 46,
							height: 46,
							bgcolor: "background.default",
							border: "1px solid #d9d9d9",
							cursor: "pointer",
						}}
					>
						<IoIosMore color="#505050" />
					</Avatar>
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
						<CircularProfile userImgUrl={user.displayImage} userId={user._id} />
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
