import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { TestScreen } from "./screens/test/test.js";

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
// import { AssetScreen } from "./screens/asset/AssetScreen.jsx";
import HomeScreen from "./screens/home/HomeScreen";
import { CreateScreen } from "./screens/create/CreateScreen.jsx";
import { ProfileScreen } from "./screens/profile/ProfileScreen";

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

				window.ethereum.on("networkChanged", function (networkId) {
					dispatch(actionSwitchChain(networkId));
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function fetchCurrentUser() {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");
		let response;
		if (!user || !token) {
			response = await authHttpService.fetchUser();
			if (!response.error) {
				dispatch(login({ user: response.data }));
			}
		} else {
			dispatch(login({ user: JSON.parse(user) }));
		}
		console.log(localStorage);
	}

	useEffect(() => {
		connectAndListenWallet();
		fetchCurrentUser();
	});

	return (
		<Router>
			<Routes>
				<Route path="/" exact element={<HomeScreen />} />
				<Route path="/profile" exact element={<ProfileScreen />} />
				{/* <Route path="/test" exact element={<TestScreen />} /> */}
				{/* <Route path="/asset" exact element={<AssetScreen />} /> */}
				<Route path="/create" exact element={<CreateScreen />} />
				<Route path="*" exact element={<p>Invalid route</p>} />
			</Routes>
		</Router>
	);
}

export default App;
