import "./home.css";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { SideNav } from "../../components/sidenav/sidenav";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import { ActiveSaleComponent } from "../../components/activeSale/ActiveSale";
import { HighlightsComponent } from "../../components/highlights/HighlightsComponent";
import { useEffect, useState } from "react";
import { AssetHttpService } from "../../api/asset";
import { SaleHttpService } from "../../api/sale";
import { DisplayHttpService } from "../../api/display";
import { Box } from "@mui/material";
import { FooterComponent } from "../../components/FooterComponent";
import { useSelector } from "react-redux";
import Web3Utils from "web3-utils";

function HomeScreen() {
	const assetHttpService = new AssetHttpService();
	const saleHttpService = new SaleHttpService();
	const displayHttpService = new DisplayHttpService();
	const chainId = useSelector((state) => state.walletReducer.chainId);
	const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
	const [onSaleItems, setOnSaleItems] = useState([]);
	const [topCreators, setTopCreators] = useState([]);

	async function getRecentlyAdded() {
		const resolved = await assetHttpService.getRecentlyAdded({
			chainId: Web3Utils.toHex(chainId),
		});
		setRecentlyAddedItems(resolved.data);
	}

	async function getActiveSales() {
		const resolved = await saleHttpService.getActiveSales({
			chainId: Web3Utils.toHex(chainId),
		});
		setOnSaleItems(resolved.data.map((e) => e.asset_id));
	}

	async function getTopCollectors() {
		const resolved = await displayHttpService.getTopCreators();
		setTopCreators(resolved.data.map((e) => e.user));
	}

	useEffect(() => {
		getTopCollectors();
		if (chainId) {
			getRecentlyAdded();
			getActiveSales();
		}
	}, [chainId]);

	return (
		<div className="container">
			<div className="navbar">
				<NavbarComponent />
			</div>
			<Box className="body" sx={{ justifyContent: { xs: "center" } }}>
				<Box className="left" sx={{ display: { xs: "none", md: "block" } }}>
					<SideNav />
				</Box>
				<Box
					className="center"
					sx={{
						width: { xs: "auto", md: "79.6vw" },
						height: { xs: "auto", md: "89vh" },
						padding: { xs: "20px 0" },
					}}
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "24px",
							flexDirection: { xs: "column", md: "row" },
						}}
					>
						<div style={{ flex: 2 }}>
							{(onSaleItems.length > 0 && (
								<ActiveSaleComponent asset={onSaleItems[0]} />
							)) ||
								(recentlyAddedItems.length > 0 && (
									<ActiveSaleComponent asset={recentlyAddedItems[0]} />
								))}
						</div>
						<Box
							sx={{
								flex: 1,
								marginLeft: { md: "24px" },
								marginTop: { xs: "24px", md: "0" },
							}}
						>
							<HighlightsComponent
								data={topCreators.slice(0, 8)}
								title="Popular Creators"
							/>
						</Box>
					</Box>
					<CollectionContainer
						title={"Newly Added"}
						assets={recentlyAddedItems}
					/>
					<div style={{ margin: "20px" }}></div>
					<CollectionContainer title={"On Sale"} assets={onSaleItems} />
				</Box>
			</Box>
			<Box sx={{ display: { xs: "block", md: "none" } }}>
				<FooterComponent />
			</Box>
		</div>
	);
}

export default HomeScreen;
