import { useDispatch } from "react-redux";
import { login, logout } from "../state/actions/auth";
import { AuthHttpService } from "../api/auth";
import {
	connectWalletToSite,
	getChainId,
	getWalletAddress,
} from "../utils/wallet";
import {
	switchAccount,
	switchChain as actionSwitchChain,
} from "../state/actions/wallet";
import { addNotification } from "../state/actions/notifications";

const styles = {
	backgroundColor: "#00c775",
	color: "white",
	borderRadius: "16px",
	padding: "4px 8px",
	margin: "0px 16px",
	cursor: "pointer",
};

export function ConnectComponent() {
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

				window.ethereum.on("chainChanged", async function (networkId) {
					// dispatch(actionSwitchChain(Web3.utils.toHex(networkId)));
					let chainId = await getChainId();
					dispatch(actionSwitchChain(chainId));
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
			} else {
				alert(
					"Non-Ethereum browser detected. You should consider trying MetaMask!"
				);
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
	return (
		<div
			onClick={() => {
				connectAndListenWallet();
				fetchCurrentUser();
			}}
			style={styles}
		>
			<p>Connect Wallet</p>
		</div>
	);
}
