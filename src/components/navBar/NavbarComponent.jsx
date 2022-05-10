import { useSelector } from "react-redux";
import { CircularProfile } from "../circularProfile/circularProfile";
import { ConnectComponent } from "../ConnectComponent";
import { SearchComponent } from "../search/search";
import { CreateComponent } from "../CreateComponent";
import "./navBar.css";
import { useNavigate } from "react-router-dom";

export function NavbarComponent() {
	const authenticated = useSelector((state) => state.authReducer.authenticated);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();

	return (
		<div className="navbar-container">
			<div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
				<img src="spriyo.png" alt="logo" height={36} />
			</div>
			<div className="navbar-actions">
				{/* search */}
				<SearchComponent />
				{authenticated ? <CreateComponent /> : <div></div>}
				{/* profile */}
				{authenticated ? (
					<div onClick={() => navigate("/profile")}>
						<CircularProfile userImgUrl={user.displayImage} />
					</div>
				) : (
					<ConnectComponent />
				)}
			</div>
		</div>
	);
}
