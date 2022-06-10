import {
	Box,
	FormControl,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
} from "@mui/material";
import { ChainsConfig } from "../constants";
import React, { useEffect, useState } from "react";
import { getChainId, switchChain } from "../utils/wallet";

export const ChangeNetworkComponent = () => {
	const [networkid, setNetworkid] = useState(56);
	const cid = getChainId();

	async function handleNetworkChange(newNetworkid) {
		let chain;
		for (const c in ChainsConfig) {
			if (newNetworkid === ChainsConfig[c].chainId) {
				chain = ChainsConfig[c];
			}
		}
		if (chain) {
			await switchChain(chain);
			setNetworkid(newNetworkid);
		}
	}

	useEffect(() => {
		if (cid) {
			if (cid !== 56 && cid !== 97 && cid !== 8080 && cid !== 80001) {
				setNetworkid(56);
			} else {
				setNetworkid(cid);
			}
		}
		return () => {};
	}, [cid]);

	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 120 }} size="small">
				<InputLabel id="chain-selector-label">Network</InputLabel>
				<Select
					labelId="chain-selector-label"
					id="chain-selector"
					value={networkid}
					label="Select Chain"
					onChange={(e) => handleNetworkChange(e.target.value)}
				>
					<ListSubheader>Mainnet</ListSubheader>
					<MenuItem value={56}>Binance Smart Chain</MenuItem>
					<ListSubheader>Testnets</ListSubheader>
					<MenuItem value={97}>Binance Testnet</MenuItem>
					<MenuItem value={80001}>Polygon Testnet</MenuItem>
					<MenuItem value={8080}>Shardeum Liberty 1.0</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};
