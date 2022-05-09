import "./home.css";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { SideNav } from "../../components/sidenav/sidenav";
import { CollectionContainer } from "../../components/collectionContainer/collectionContainer";
import { ActiveBidComponent } from "../../components/activeBid/activeBid";
import { HighlightsComponent } from "../../components/highlights/hightlights";
import { useEffect, useState } from "react";
import { AssetHttpService } from "../../api/asset";
import { SaleHttpService } from "../../api/sale";

function HomeScreen() {
	const assetHttpService = new AssetHttpService();
	const saleHttpService = new SaleHttpService();
	const [recentlyAddedItems, setRecentlyAddedItems] = useState([]);
	const [onSaleItems, setOnSaleItems] = useState([]);

	async function getRecentlyAdded() {
		const resolved = await assetHttpService.getRecentlyAdded();
		setRecentlyAddedItems(resolved.data);
	}

	async function getActiveSales() {
		const resolved = await saleHttpService.getActiveSales();
		setOnSaleItems(resolved.data.map((e) => e.asset_id));
	}

	useEffect(() => {
		getRecentlyAdded();
		getActiveSales();
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
								data={[1, 2, 3, 4, 5, 6]}
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
