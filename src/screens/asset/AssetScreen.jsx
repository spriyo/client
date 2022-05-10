import { ActiveBidComponent } from "../../components/activeBid/activeBid";
// import { FooterComponent } from "../../components/footer/FooterComponent";
import { NavbarComponent } from "../../components/navBar/NavbarComponent";
import "./asset.css";

export function AssetScreen() {
	return (
		<div className="container">
			<div className="navbar">
				<NavbarComponent />
			</div>
			<div className="">
				<div style={{ width: "60vw" }} className="activebid-Container">
					<ActiveBidComponent />
				</div>
			</div>
			<div>{/* <FooterComponent /> */}</div>
		</div>
	);
}
