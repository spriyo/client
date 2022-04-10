import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home/home.js";
import { TestScreen } from "./screens/test/test.js";

import {
	switchAccount,
	switchChain as actionSwitchChain,
} from "./state/actions/wallet";

import { useDispatch } from "react-redux";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		window.ethereum.on("accountsChanged", function (accounts) {
			dispatch(switchAccount(accounts[0]));
		});

		window.ethereum.on("networkChanged", function (networkId) {
			dispatch(actionSwitchChain(networkId));
		});
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
