import "./home.css";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { SideNav } from "../../components/sidenav/sidenav";
import { CollectionContainer } from "../../components/collectionContainer/CollectionContainerComponent";
import { ActiveBidComponent } from "../../components/activeBid/activeBid";
import { HighlightsComponent } from "../../components/highlights/HighlightsComponent";
import { useEffect, useState } from "react";
import { AssetHttpService } from "../../api/asset";
import { SaleHttpService } from "../../api/sale";
import { DisplayHttpService } from "../../api/display";

function HomeScreen() {
	const assetHttpService = new AssetHttpService();
	const saleHttpService = new SaleHttpService();
	const displayHttpService = new DisplayHttpService();
	const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
	const [onSaleItems, setOnSaleItems] = useState([]);
	const [topCreators, setTopCreators] = useState([]);

	async function getRecentlyAdded() {
		const resolved = await assetHttpService.getRecentlyAdded();
		setRecentlyAddedItems(resolved.data);
	}

	async function getActiveSales() {
		const resolved = await saleHttpService.getActiveSales();
		setOnSaleItems(resolved.data.map((e) => e.asset_id));
	}

	async function getTopCollectors() {
		const resolved = await displayHttpService.getTopCreators();
		setTopCreators(resolved.data.map((e) => e.user));
	}

	useEffect(() => {
		getRecentlyAdded();
		getActiveSales();
		getTopCollectors();
	}, []);

	return (
		<div className="container">
			<div className="navbar">
				<NavbarComponent />
			</div>
			<div className="body">
				<div className="left">
					<SideNav />
				</div>
				<div className="center">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "24px",
						}}
					>
						<div style={{ flex: 2 }}>
							<ActiveBidComponent />
						</div>
						<div style={{ flex: 1, marginLeft: "24px" }}>
							<HighlightsComponent
								data={topCreators.slice(0, 8)}
								title="Popular Creators"
							/>
						</div>
					</div>
					<CollectionContainer title={"Trending"} assets={recentlyAddedItems} />
					<div style={{ margin: "20px" }}></div>
					<CollectionContainer title={"Collections"} assets={onSaleItems} />
				</div>
			</div>
		</div>
	);
}

export default HomeScreen;
