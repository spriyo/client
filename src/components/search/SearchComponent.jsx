import "./search.css";
// import { SearchCardComponent } from "../searchCard/searchCard";
// const Moralis = require("moralis");
import magnifier from "../../assets/Magnifier.png";

export function SearchComponent() {
	return (
		<div>
			<div className="search-container">
				<input type="search" id="search" placeholder="Search" />
				<img src={magnifier} alt="search" height={24} />
			</div>
		</div>
	);
}
