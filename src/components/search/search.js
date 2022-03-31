import "./search.css";
import { useState } from "react";
// import { SearchCardComponent } from "../searchCard/searchCard";
// const Moralis = require("moralis");

export function SearchComponent() {
	return (
		<div>
			<div className="search-container">
				<input type="search" id="search" placeholder="Search" />
				<img src="Magnifier.png" height={24} />
			</div>
		</div>
	);
}
