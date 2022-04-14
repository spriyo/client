import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home/home.js";
import { TestScreen } from "./screens/test/test.js";

import {
	switchAccount,
	switchChain as actionSwitchChain,
} from "./state/actions/wallet";

import { useDispatch } from "react-redux";
import { AuthHttpService } from "./api/auth.js";
import { login } from "./state/actions/auth.js";
import {
	connectWalletToSite,
	getChainId,
	getWalletAddress,
} from "./utils/wallet.js";

function App() {
	const authHttpService = new AuthHttpService();
	const dispatch = useDispatch();
	async function connectAndListenWallet() {
		try {
			const walletConnected = await connectWalletToSite();
			if (walletConnected) {
				let walletAddress = await getWalletAddress();
				dispatch(switchAccount(walletAddress));
				let chainId = await getChainId();
				dispatch(actionSwitchChain(chainId));

				// Listeners
				window.ethereum.on("accountsChanged", function (accounts) {
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
		let response = await authHttpService.getUser();
		if (!response.error) {
			dispatch(login({ user: response.data }));
		}
	}

	useEffect(() => {
		connectAndListenWallet();
		fetchCurrentUser();
	});

	return (
		<Router>
			<Routes>
				<Route path="/" exact element={<Home />} />
				<Route path="/test" exact element={<TestScreen />} />
			</Routes>
		</Router>
	);
}

export default App;
