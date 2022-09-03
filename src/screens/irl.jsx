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
    Grid
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import Meetjson from "../contracts/Meet.json";
import { store } from "../state/store";
import { switchChain } from "../utils/wallet";
import { ChainsConfig } from "../constants";
import { AssetHttpService } from "../api/asset";
import { useNavigate } from "react-router-dom";
const contractAddress = process.env.IRL_CONTRACT;

export const IRLScreen = () => {
	const [loading, setLoading] = useState(false);
    const [irls, setIrls] = useState([{}]);
    const [isAdmin, setIsAdmin] = useState(false)
	const nftContract = useSelector((state) => state.contractReducer.nftContract);
	const assetHttpService = new AssetHttpService();
	const authReducer = store.getState().authReducer;
	const dispatch = useDispatch();
	const navigate = useNavigate();


    useEffect(()=>{
        fetchIRL();
        return () => {};
    }, [])


    const redirectToActivity = (id) => {
        try {
            navigate(`/irls/${id}`)
        } catch (error) {
            
        }
    }

    const fetchIRL = async () => {
        try {
            setLoading(true)
            const contractInstance = new window.web3.eth.Contract(
                Meetjson.abi,
                contractAddress
            );
            const userAddress = authReducer.user.address;
            let checkAdmin = await contractInstance.methods.admins(userAddress).call();
            setIsAdmin(checkAdmin)
            let count = await contractInstance.methods.irlCount().call({from: userAddress});
            let temp = [];
            for (let i = 1; i <= count; i++) {
                let data = await contractInstance.methods.irls(i).call({});
                temp.push(Object.assign({
                    id: data.id,
                    name: data.name,
                    image: data.image
                }));
            }
            setIrls(temp);
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
					<Typography variant="h2">IRL'S</Typography>
					<Typography variant="h6">
						Store all your digital asset's in one place, You can do that with
						Spriyo Import🥳
					</Typography>
				</Box>
                <Grid container spacing={0}>
                {irls.length >0 && irls.map((ele, i) => {
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
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    {isAdmin && <CardActions>
                        <Button size="small" color="primary" onClick={()=> redirectToActivity(ele.id)} >
                            Activity
                        </Button>
                    </CardActions>}
                </Card>
                    )
                }) }
                {/* <Card sx={{ maxWidth: 345 }} style={{padding: "5px"}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="/meta_banner_image.png"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Mumbai
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            Activity
                        </Button>
                    </CardActions>
                </Card> */}
                </Grid>
			</Box>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
