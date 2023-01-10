import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
	switchAccount,
	switchChain as actionSwitchChain,
} from "./state/actions/wallet";

import { useDispatch } from "react-redux";
import { AuthHttpService } from "./api/auth.js";
import { login, logout } from "./state/actions/auth.js";
import { connectWalletToSite, getWalletAddress } from "./utils/wallet.js";
import { AssetScreen } from "./screens/asset/AssetScreen.jsx";
import { CreateScreen } from "./screens/create/CreateScreen.jsx";
import { ProfileScreen } from "./screens/profile/ProfileScreen";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import marketJsonInterface from "./contracts/Market.json";
import nftJsonInterface from "./contracts/Spriyo.json";
import auctionJsonInterface from "./contracts/Auction.json";
import nft1155JsonInterface from "./contracts/Spriyo1155.json";
import {
	initAuctionContract,
	initMarketContract,
	initNFT1155Contract,
	initNFTContract,
} from "./state/actions/contracts.js";
import { ExploreScreen } from "./screens/ExploreScreen";
import { addNotification } from "./state/actions/notifications";
import { FavoritesScreen } from "./screens/Favorites";
import { InteractIrl } from "./screens/InteractIrl";
import { IRLScreen } from "./screens/irl";
import { IRLActivityScreen } from "./screens/irlActivity";
import { IrlCreate } from "./screens/IrlCreate";
import { SelectCreate } from "./screens/create/select/SelectCreate";
import { Create1155 } from "./screens/create/erc1155/Create1155";
import NotFound from "./screens/NotFound";
import { ActiveBids } from "./screens/ActiveBids";
import { Connect } from "./screens/Connect";
import { NotificationScreen } from "./screens/NotifcationScreen";
import { Helmet } from "react-helmet";
import { Collection } from "./screens/collection/Collection";
import { Collections } from "./screens/collection/Collections";
import { Create } from "./screens/collection/create/Create";
import { Create as CreateDrop } from "./screens/collection/drop/Create";
import { HomeScreen2 } from "./screens/home/HomeScreen2";
import ReactGA from "react-ga";
import { CHAIN } from "./constants";
ReactGA.initialize(process.env.REACT_APP_GA_TRACKING);
// <HighlightsComponent title='Shardeum Chat🔥' />; CHAT COMPONENT

function App() {
	const authHttpService = new AuthHttpService();
	const dispatch = useDispatch();
	async function connectAndListenWallet() {
		try {
			const walletConnected = await connectWalletToSite();
			if (walletConnected) {
				let walletAddress = await getWalletAddress();
				dispatch(actionSwitchChain(CHAIN.chainId));
				// Load contracts
				await initializeMarketContract();
				await initializeNftContract();
				await initializeAuctionContract();

				// Login to account if not logged
				const token = localStorage.getItem("token");
				if (!token) {
					const authResponse = await authHttpService.signIn();
					dispatch(switchAccount(walletAddress));
					dispatch(login({ user: authResponse.user }));
				}

				// Listeners
				window.ethereum.on("accountsChanged", async function (accounts) {
					// Signout of current account
					authHttpService.signOut();
					dispatch(logout());

					// Signin to new account
					const authResponse = await authHttpService.signIn();
					dispatch(login({ user: authResponse.user }));
					dispatch(switchAccount(accounts[0]));
				});

				window.ethereum.on("chainChanged", async function (networkId) {
					// Load contracts
					await initializeMarketContract();
					await initializeNftContract();
					dispatch(
						addNotification(
							"If you've switched to test network, you can use dev.spriyo.xyz for testing.",
							"Open Site",
							1,
							() => {
								window.open("https://dev.spriyo.xyz");
							}
						)
					);
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function fetchCurrentUser() {
		let response = await authHttpService.getUser();
		if (!response.error) {
			dispatch(login({ user: response.data }));
		}
		console.log(localStorage);
	}

	async function initializeMarketContract() {
		try {
			const contract = new window.web3.eth.Contract(
				marketJsonInterface.abi,
				CHAIN.marketContract
			);
			dispatch(initMarketContract(contract));
		} catch (error) {
			console.log(error);
		}
	}

	async function initializeAuctionContract() {
		try {
			const contract = new window.web3.eth.Contract(
				auctionJsonInterface.abi,
				CHAIN.auctionContract
			);
			dispatch(initAuctionContract(contract));
		} catch (error) {
			console.log(error);
		}
	}

	async function initializeNftContract() {
		try {
			const contract = new window.web3.eth.Contract(
				nftJsonInterface.abi,
				CHAIN.nftContract
			);

			const contract1155 = new window.web3.eth.Contract(
				nft1155JsonInterface.abi,
				CHAIN.nft1155Contract
			);
			dispatch(initNFTContract(contract));
			dispatch(initNFT1155Contract(contract1155));
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		connectAndListenWallet();
		fetchCurrentUser();
		ReactGA.pageview(window.location.pathname + window.location.search);
	});

	return (
		<ThemeProvider theme={theme}>
			<Helmet>
				{/* <!-- Primary Meta Tags --> */}
				<meta name="title" content="Spriyo.xyz - Shardeum NFT Marketplace" />
				<meta name="description" content="Shardeum's first NFT marketplace" />
				<meta property="og:image" content="/meta_banner_image.png" />
				<meta name="twitter:image" content="/meta_banner_image.png" />
			</Helmet>
			<Router>
				<Routes>
					<Route path="/" exact element={<HomeScreen2 />} />
					<Route path="/:username" exact element={<ProfileScreen />} />
					{/* :username can be address, username or _id */}
					<Route
						path="/assets/:contract_address/:token_id"
						exact
						element={<AssetScreen />}
					/>
					<Route path="/collections" exact element={<Collections />} />
					<Route path="/collections/create" exact element={<Create />} />
					<Route
						path="/collections/:collection_name"
						exact
						element={<Collection />}
					/>
					{/* :collection_name can be contract_address or unique name */}
					<Route path="/drop/create" exact element={<CreateDrop />} />
					<Route path="/create" exact element={<CreateScreen />} />
					<Route path="/connect" exact element={<Connect />} />
					<Route path="/create/select" exact element={<SelectCreate />} />
					<Route path="/create/multiple" exact element={<Create1155 />} />
					<Route path="/explore" exact element={<ExploreScreen />} />
					<Route path="/bids" exact element={<ActiveBids />} />
					<Route path="/irls" exact element={<IRLScreen />} />
					<Route path="/irls/create" exact element={<IrlCreate />} />
					<Route path="/irls/:irlId" exact element={<IRLActivityScreen />} />
					<Route
						path="/irls/interact/:irlId/:activityId"
						exact
						element={<InteractIrl />}
					/>

					<Route path="/notifications" exact element={<NotificationScreen />} />
					<Route path="/favorites" exact element={<FavoritesScreen />} />
					<Route path="/user/notfound" exact element={<NotFound />} />
					<Route path="*" exact element={<NotFound />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
