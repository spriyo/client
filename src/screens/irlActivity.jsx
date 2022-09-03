import {
	Box,
	Button,
	Divider,
	Typography,
    Card,
    CardContent,
    CardActions,
    CardActionArea,
    CardMedia,
    Grid,
    Modal
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import Meetjson from "../contracts/Meet.json";
import { store } from "../state/store";
import { useParams } from "react-router-dom";
const contractAddress = process.env.IRL_CONTRACT;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export const IRLActivityScreen = () => {
    const { irlId } = useParams()
	const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([{}]);
    const [qrData, setQrData] = useState("");
    const [open, setOpen] = useState(false);
	const authReducer = store.getState().authReducer;


    useEffect(()=>{
        fetchIRL();
        return () => {};
    }, [])

    const handleOpen = (id) => {
        // REACT_APP_BASE_URL
        // setQrData(JSON.stringify(activities.find(ele => ele.id === id)));
        activities.find(ele => {
            if(ele.id === id) {
                setQrData(`${process.env.REACT_APP_BASE_URL}/interactirl/${irlId}/${id}`)
            }
        })
        setOpen(true)
    };
    const handleClose = () => setOpen(false);

    const fetchIRL = async () => {
        try {
            setLoading(true)
            const contractInstance = new window.web3.eth.Contract(
                Meetjson.abi,
                contractAddress
            );
            const userAddress = authReducer.user.address;
            let count = await contractInstance.methods._activityCount().call({from: userAddress});
            let temp = [];
            for (let i = 1; i <= count; i++) {
                let data = await contractInstance.methods.activities(irlId, i).call();
                
               data.irlId == irlId && temp.push(Object.assign({
                    id: data.id,
                    name: data.name,
                    award: data.award
                }));
            }
            setActivities(temp);
            setLoading(false)
        } catch (error) {
            console.log("error in fetch irl", error.message, error.stack)
        }
    }

	return (
		<Box>
			<NavbarComponent />
			<Divider />
			<Box
				height={loading ? "" : "55vh"}
				p={4}
				display="flex"
				alignItems="center"
				flexDirection="column"
			>
				<Box p={1}>
					<Typography variant="h2">Activities</Typography>
					<Typography variant="h6">
						Store all your digital asset's in one place, You can do that with
						Spriyo Import🥳
					</Typography>
				</Box>
                <Grid container spacing={0}>
                {activities.length >0 && activities.map((ele, i) => {
                    return (
                        <Card sx={{ maxWidth: 345 }} style={{padding: "5px"}} key={i}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/meta_banner_image.png"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {ele.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Reward : {ele.award}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => handleOpen(ele.id)}>
                            Print
                        </Button>
                    </CardActions>
                </Card>
                    )
                }) }
                <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Scan To Participate
          </Typography>
         <div style={{ background: 'white', padding: '16px' }}>
          <QRCode value={qrData} />
          </div>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
                </Grid>
			</Box>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
