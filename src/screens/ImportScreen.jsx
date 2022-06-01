import {
	Box,
	Button,
	Divider,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FooterComponent } from "../components/FooterComponent";
import { NavbarComponent } from "../components/navBar/NavbarComponent";
import { useDispatch, useSelector } from "react-redux";
import nftJsonInterface from "../contracts/Spriyo.json";
import FoundationLogo from "../assets/foundationlogo.png";
import BinanceLogo from "../assets/binancelogo.png";
import WazirxLogo from "../assets/wazirxlogo.png";
import { BiImport } from "react-icons/bi";
import { Watch } from "react-loader-spinner";
import { store } from "../state/store";
import { getChainId, switchChain } from "../utils/wallet";
import { ChainsConfig } from "../constants";
import { switchChain as actionSwitchChain } from "../state/actions/wallet";
import { clearNotification } from "../state/actions/notifications";
import { AssetHttpService } from "../api/asset";
import { useNavigate } from "react-router-dom";

export const ImportScreen = () => {
	const [loading, setLoading] = useState(false);
	const [totalAssets, setTotalAssets] = useState(0);
	const [tokenID, setTokenID] = useState(undefined);
	const [platform, setPlatform] = React.useState("");
	const [successfulImport, setSuccessfulImport] = useState(false);
	const [totalImportedAssets, setTotalImportedAssets] = useState(0);
	const [currentImportingAsset, setCurrentImportingAsset] = useState(0);
	const nftContract = useSelector((state) => state.contractReducer.nftContract);
	const assetHttpService = new AssetHttpService();
	const authReducer = store.getState().authReducer;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function importToken() {
		if (!platform || platform === "" || !tokenID || loading) return;
		await switchNetwork(platform);
		const chainId = await getChainId();
		const contract_address = getContractAddress(platform);

		setLoading(true);
		const contract = new window.web3.eth.Contract(
			nftJsonInterface.abi,
			contract_address
		);
		const userAddress = authReducer.user.address;

		const tokenURI = await contract.methods
			.tokenURI(tokenID)
			.call({ from: userAddress });

		const data = {
			chainId,
			metadata_url: tokenURI,
			contract_address,
			item_id: tokenID,
		};
		const resolved = await assetHttpService.importAsset(data);
		if (resolved.statusCode === 201 || resolved.statusCode === 409) {
			setTotalImportedAssets(1);
		}
		setLoading(false);
		setSuccessfulImport(true);
		await new Promise((res, rej) =>
			setTimeout(() => {
				res(true);
			}, 5000)
		);
		navigate("/");
	}

	async function importTokens() {
		if (!platform || platform === "" || loading) return;
		await switchNetwork(platform);
		const chainId = await getChainId();
		const contract_address = getContractAddress(platform);

		setLoading(true);
		const contract = new window.web3.eth.Contract(
			nftJsonInterface.abi,
			contract_address
		);

		const userAddress = authReducer.user.address;
		const totalTokens = await contract.methods
			.balanceOf(userAddress)
			.call({ from: userAddress });
		setTotalAssets(totalTokens);

		let imported = 0;
		for (var i = 0; i < totalTokens; i++) {
			const tokenId = await contract.methods
				.tokenOfOwnerByIndex(userAddress, i)
				.call({ from: userAddress });
			setCurrentImportingAsset(i);

			const tokenURI = await contract.methods
				.tokenURI(tokenId)
				.call({ from: userAddress });

			const data = {
				chainId,
				metadata_url: tokenURI,
				contract_address,
				item_id: tokenId,
			};
			const resolved = await assetHttpService.importAsset(data);
			if (resolved.statusCode === 201 || resolved.statusCode === 409) {
				imported++;
				setTotalImportedAssets(imported);
			}
		}
		setLoading(false);
		setSuccessfulImport(true);
		await new Promise((res, rej) =>
			setTimeout(() => {
				res(true);
			}, 5000)
		);
		navigate("/");
	}

	async function switchNetwork(newPlatform) {
		switch (newPlatform) {
			case "wazirx":
				await switchChain(ChainsConfig.BINANCE_SMART_CHAIN);
				return;
			case "spriyo-dev":
				await switchChain(ChainsConfig.POLYGON_TESTNET);
				return;
			default:
				await switchChain(ChainsConfig.BINANCE_SMART_CHAIN);
		}
	}

	const handleChange = async (event) => {
		setPlatform(event.target.value);
		await switchNetwork(event.target.value);
		let chainId = await getChainId();
		dispatch(actionSwitchChain(chainId));
		dispatch(clearNotification());
	};

	function getContractAddress(platform) {
		switch (platform) {
			case "wazirx":
				return "0x23Cad0003e3A2b27b12359B25c25dD9a890AF8e1";
			case "spriyo-dev":
				return "0x457533D07d3EC956523E15F34c289f0A0bE3dAcA";
			default:
				return "0x23Cad0003e3A2b27b12359B25c25dD9a890AF8e1";
		}
	}

	useEffect(() => {
		if (nftContract) {
			// importTokens();
		}
		return () => {};
	}, [nftContract]);

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
					<Typography variant="h2">Import Tokens</Typography>
					<Typography variant="h6">
						Store all your digital asset's in one place, You can do that with
						Spriyo Import🥳
					</Typography>
				</Box>
				<Box
					border={"1px solid lightgrey"}
					p={2}
					display="flex"
					alignItems="center"
					flexDirection="column"
				>
					<Box>
						<Box>
							<Typography variant="h5" textAlign="center">
								Select Platform
							</Typography>
						</Box>
						<FormControl sx={{ m: 1, minWidth: 180 }} size="small">
							<InputLabel id="demo-select-small">Platform</InputLabel>
							<Select
								labelId="demo-select-small"
								id="demo-select-small"
								value={platform}
								label="Platform"
								onChange={handleChange}
							>
								<MenuItem value={"wazirx"}>
									<Box display={"flex"}>
										<img height="25px" src={WazirxLogo} alt="Wazirx Logo" />
										<Box pl={1}>Wazirx</Box>
									</Box>
								</MenuItem>
								{/* <MenuItem value={"spriyo-dev"}>
									<Box display={"flex"}>
										<Box pl={1}>Spriyo</Box>
									</Box>
								</MenuItem> */}
								<MenuItem value="" disabled={true}>
									<Box display={"flex"}>
										<img height="25px" src={BinanceLogo} alt="Binance Logo" />
										<Box pl={1}>Binance NFT</Box>
									</Box>
								</MenuItem>
								<MenuItem value="" disabled={true}>
									<Box display={"flex"}>
										<img
											height="25px"
											src={FoundationLogo}
											alt="Foundation Logo"
										/>
										<Box pl={1}>Foundation</Box>
									</Box>
								</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Button
						variant="contained"
						size="small"
						endIcon={<BiImport />}
						onClick={importTokens}
					>
						Import All
					</Button>
					<Box pt={2} pb={2}>
						( OR )
					</Box>
					<Typography textAlign="center" variant="h5">
						Import specific token
					</Typography>
					<Box pb={1} pt={1}>
						<TextField
							title="Token ID"
							size="small"
							sx={{ maxWidth: 180 }}
							placeholder="Enter Token ID"
							type={"number"}
							onChange={(e) => setTokenID(e.target.value)}
						/>
					</Box>
					<Button
						variant="contained"
						size="small"
						endIcon={<BiImport />}
						onClick={importToken}
					>
						Import
					</Button>
					{loading ? (
						<Box
							mt={3}
							display="flex"
							alignItems="center"
							flexDirection={"column"}
						>
							<Box pl={1}>
								<Typography variant="h3" textAlign="center">
									Total Assets Found : {totalAssets}
								</Typography>
								<Typography variant="h3" textAlign="center">
									Importing {currentImportingAsset + 1} / {totalAssets}
								</Typography>
							</Box>
							<Box p={1}>
								<Box pt={1}>
									<Watch
										height={50}
										visible={loading}
										ariaLabel="loading-indicator"
									/>
								</Box>
							</Box>
							<Typography variant="h3" textAlign="center">
								Importing tokens <br />
								please wait...
							</Typography>
						</Box>
					) : (
						""
					)}
					{successfulImport ? (
						<Box
							mt={3}
							display="flex"
							alignItems="center"
							flexDirection={"column"}
						>
							<Typography variant="h6" textAlign={"center"}>
								Successfully imported{" "}
								<span style={{ fontWeight: "bold" }}>
									{totalImportedAssets}
								</span>{" "}
								assets into Spriyo💪🏻, Navigating to home🏠
							</Typography>
						</Box>
					) : (
						""
					)}
				</Box>
			</Box>
			<Divider />
			<FooterComponent />
		</Box>
	);
};
