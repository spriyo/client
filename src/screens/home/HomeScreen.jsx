import "./home.css";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { SideNav } from "../../components/sidenav/sidenav";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import { ActiveSaleComponent } from "../../components/activeSale/ActiveSale";
import { HighlightsComponent } from "../../components/highlights/HighlightsComponent";
import { useEffect, useState } from "react";
import { SaleHttpService } from "../../api/sale";
import { DisplayHttpService } from "../../api/display";
import { Box } from "@mui/material";
import { FooterComponent } from "../../components/FooterComponent";
import { useDispatch, useSelector } from "react-redux";
import { TopNotification } from "../../components/topNotification/TopNotification";
import { ChangeNetworkComponent } from "../../components/ChangeNetworkComponent";
import { switchChain } from "../../state/actions/wallet";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../../state/actions/notifications";

function HomeScreen() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const saleHttpService = new SaleHttpService();
	const displayHttpService = new DisplayHttpService();
	const chainId = useSelector((state) => state.walletReducer.chainId);
	const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
	const [onSaleItems, setOnSaleItems] = useState([]);
	const [topCreators, setTopCreators] = useState([]);

	async function getRecentlyAdded() {
		const resolved = await displayHttpService.searchAssets({
			chainId: chainId,
		});
		if (!resolved.error) {
			setRecentlyAddedItems(resolved.data);
		}
	}

	async function getActiveSales() {
		const resolved = await saleHttpService.getActiveSales({
			chainId: chainId,
		});
		setOnSaleItems(resolved.data.map((e) => e.asset_id));
	}

	async function getTopCollectors() {
		const resolved = await displayHttpService.getTopCreators();
		setTopCreators(resolved.data.map((e) => e.user));
	}

	function onNetworkChange(network) {
		if (network === 0) {
			dispatch(switchChain(""));
		} else {
			dispatch(switchChain(network.chainId));
		}
	}

	function updateNotification() {
		// Remove in next build
		dispatch(
			addNotification(
				"You can now try out Sell, Buy, Offer and Auction features🥳",
				"Create NFT",
				1,
				() => {
					navigate("/create");
				}
			)
		);
	}

	useEffect(() => {
		getTopCollectors();
		getRecentlyAdded();
		getActiveSales();
		updateNotification();
	}, [chainId]);

	return (
		<Box>
			<TopNotification />
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
							padding: { xs: "20px 8px", md: "20px" },
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
									title="Shardeum Chat🔥"
								/>
							</Box>
						</Box>
						<ChangeNetworkComponent
							onNetworkChange={onNetworkChange}
							enableAll={true}
						/>
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
		</Box>
	);
}

export default HomeScreen;
