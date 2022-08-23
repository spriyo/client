import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
	switchAccount,
	switchChain as actionSwitchChain,
} from "./state/actions/wallet";

import { useDispatch } from "react-redux";
import { AuthHttpService } from "./api/auth.js";
import { login, logout } from "./state/actions/auth.js";
import {
	connectWalletToSite,
	getChainId,
	getWalletAddress,
} from "./utils/wallet.js";
import { AssetScreen } from "./screens/asset/AssetScreen.jsx";
import HomeScreen from "./screens/home/HomeScreen";
import { CreateScreen } from "./screens/create/CreateScreen.jsx";
import { ProfileScreen } from "./screens/profile/ProfileScreen";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import marketJsonInterface from "./contracts/Market.json";
import nftJsonInterface from "./contracts/Spriyo.json";
import {
	initMarketContract,
	initNFTContract,
} from "./state/actions/contracts.js";
import { ExploreScreen } from "./screens/ExploreScreen";
import { BlogScreen } from "./screens/BlogScreen";
import { addNotification } from "./state/actions/notifications";
import { ImportScreen } from "./screens/ImportScreen";
import { FavoritesScreen } from "./screens/Favorites";
import { WelcomeScreen } from "./screens/WelcomeScreen";

function App() {
	const authHttpService = new AuthHttpService();
	const dispatch = useDispatch();
	async function connectAndListenWallet() {
		try {
			const walletConnected = await connectWalletToSite();
			if (walletConnected) {
				let walletAddress = await getWalletAddress();
				let chainId = await getChainId();
				dispatch(actionSwitchChain(chainId));
				// Load contracts
				await initializeMarketContract();
				await initializeNftContract();

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
			const currentChainId = getChainId();

			const contract = new window.web3.eth.Contract(
				marketJsonInterface.abi,
				marketJsonInterface.networks[currentChainId].address
			);
			dispatch(initMarketContract(contract));
		} catch (error) {
			console.log(error);
		}
	}

	async function initializeNftContract() {
		try {
			const currentChainId = getChainId();

			const contract = new window.web3.eth.Contract(
				nftJsonInterface.abi,
				nftJsonInterface.networks[currentChainId].address
			);
			dispatch(initNFTContract(contract));
		} catch (error) {
			console.log(error);
		}
	}

	async function welcomeAndRedirect() {
		const welcome = localStorage.getItem("welcome");
		if (!welcome) {
			window.location.replace("/welcome");
		}
	}

	useEffect(() => {
		connectAndListenWallet();
		fetchCurrentUser();
		welcomeAndRedirect();
	});

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Routes>
					<Route path="/" exact element={<HomeScreen />} />
					<Route path="/:username" exact element={<ProfileScreen />} />
					{/* :user can be contract_address or username */}
					<Route path="/asset/:id" exact element={<AssetScreen />} />
					<Route path="/create" exact element={<CreateScreen />} />
					<Route path="/explore" exact element={<ExploreScreen />} />
					<Route path="/blogs/:name" exact element={<BlogScreen />} />
					<Route path="/import" exact element={<ImportScreen />} />
					<Route path="/favorites" exact element={<FavoritesScreen />} />
					<Route path="/welcome" exact element={<WelcomeScreen />} />
					<Route path="*" exact element={<p>Invalid route</p>} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}

export default App;
