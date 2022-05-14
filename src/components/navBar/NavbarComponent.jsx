import "./navBar.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchComponent } from "../search/search";
import { ButtonComponent } from "../ButtonComponent";
import { ConnectComponent } from "../ConnectComponent";
import { CircularProfile } from "../circularProfile/circularProfile";
import { Box } from "@mui/material";
import logo from "../../assets/spriyo.png";

export function NavbarComponent() {
	const authenticated = useSelector((state) => state.authReducer.authenticated);
	const user = useSelector((state) => state.authReducer.user);
	const navigate = useNavigate();

	return (
		<Box className="navbar-container">
			<div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
				<img src={logo} alt="logo" height={36} />
			</div>
			<div className="navbar-actions">
				{/* search */}
				<Box sx={{ display: { xs: "none", md: "block" } }}>
					<SearchComponent />
				</Box>
				{authenticated ? (
					<Box mr={2} ml={2} sx={{ cursor: "pointer" }}>
						<ButtonComponent
							onClick={(event) => {
								event.preventDefault();
								navigate("/create");
							}}
							text="Create"
							rounded={true}
							filled={true}
						/>
					</Box>
				) : (
					<div></div>
				)}
				{/* profile */}
				{authenticated ? (
					<div onClick={() => navigate("/profile")}>
						<CircularProfile userImgUrl={user.displayImage} />
					</div>
				) : (
					<ConnectComponent />
				)}
			</div>
		</Box>
	);
}
