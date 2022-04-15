import "./home.css";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import { SideNav } from "../../components/sidenav/sidenav";
import { CollectionContainer } from "../../components/collectionContainer/collectionContainer";
import { ActiveBidComponent } from "../../components/activeBid/activeBid";
import { HighlightsComponent } from "../../components/highlights/hightlights";
const assets = [
	"https://f8n-production-collection-assets.imgix.net/0xCEcB7D3f6e6F5ac651E1dA21FA963a4c0022D69c/4/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0x2db77122C5971647aC67cdcD151DcA0EfCe3966f/4/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0xE8A41116E9c18c61F40a04784E402844D9D514f9/3/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0xf075134Cdca036ACf176e2B39e7490C9acB005C8/4/nft.png?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0xCEcB7D3f6e6F5ac651E1dA21FA963a4c0022D69c/4/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0x2db77122C5971647aC67cdcD151DcA0EfCe3966f/4/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0xE8A41116E9c18c61F40a04784E402844D9D514f9/3/nft.jpg?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
	"https://f8n-production-collection-assets.imgix.net/0xf075134Cdca036ACf176e2B39e7490C9acB005C8/4/nft.png?q=80&auto=format%2Ccompress&cs=srgb&max-w=1680&max-h=1680",
];

function Home() {
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
					<CollectionContainer title={"Trending"} assets={assets} />
					<div style={{ margin: "20px" }}></div>
					<CollectionContainer title={"Collections"} assets={assets} />
				</div>
			</div>
		</div>
	);
}

export default Home;
