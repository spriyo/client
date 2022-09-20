import {
	Box,
	Divider,
	Card,
	CardHeader,
	Avatar,
	Grid,
	IconButton
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { red } from '@mui/material/colors';
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { NotificationHttpService } from "../api/notification";


export const NotificationScreen = () => {
	const notificationHttpService = new NotificationHttpService();
	const [notificationList, setNotificationList] = useState([]);

	useEffect(() => {
		getNotification();
	}, [])

	const getNotification = async () => {
		let {data: {data}} = await notificationHttpService.getNotitficationList();
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


	return (
		<Box>
			<NavbarComponent />
			<Divider />
			<Grid  justify="flex-end">
				<Box>
			<h1 style={{textAlign: 'center'}}>Notifications</h1>
			</Box>

			{notificationList.length > 0 ? notificationList.map((ele, i) => {
				return(
					<Box style={{ padding: '10px'}} key={i}>
			<Card sx={{ maxWidth: 345, background: 'black' }}>
			<CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        title={ele.title}
        subheader={ele.description}
		
		action={
			<IconButton aria-label="settings" style={{color: 'white', cursor: 'pointer', fontSize: '1em'}} onClick={() => updateNotification(ele._id, true)}>
			  View
			</IconButton>
		  }
      />
	  <p style={{ color: 'white'}}>{(new Date(ele.createdAt).toDateString())}</p>
		</Card>
		</Box>
				)
			}): <h1>No Data</h1> }
		</Grid>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
