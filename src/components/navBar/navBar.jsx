import { useSelector } from "react-redux";
import { CircularProfile } from "../circularProfile/circularProfile";
import { SearchComponent } from "../search/search";
import "./navBar.css";

export function NavBar() {
	const authenticated = useSelector((state) => state.authReducer.authenticated);
	const user = useSelector((state) => state.authReducer.user);

	return (
		<div className="navbar-container">
			<img src="spriyo.png" alt="logo" height={36} />
			<div className="navbar-actions">
				{/* search */}
				<SearchComponent />
				{/* profile */}
				{authenticated ? (
					<CircularProfile userImgUrl={user.displayImage} />
				) : (
					<p>connect wallet</p>
				)}
			</div>
		</div>
	);
}
