import { CircularProfile } from "../circularProfile/circularProfile";
import { SearchComponent } from "../search/search";
import "./navBar.css";

export function NavBar() {
	return (
		<div className="navbar-container">
			<img src="spriyo.png" alt="logo" height={36} />
			<div className="navbar-actions">
				{/* search */}
				<SearchComponent />
				{/* profile */}
				<CircularProfile />
			</div>
		</div>
	);
}
