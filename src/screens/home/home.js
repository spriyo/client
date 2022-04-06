import "./home.css";
import { NavBar } from "../../components/navBar/navBar";
import { SideNav } from "../../components/sidenav/sidenav";
// import { TopNotification } from "../../components/topNotification/topNotification";

function Home() {
	return (
		<div className="container">
			<div className="navbar">
				<NavBar />
			</div>
			<div className="body">
				<div className="left">
					<SideNav />
				</div>
				<div className="center">
					<p>Body</p>
				</div>
			</div>
		</div>
	);
}

export default Home;
