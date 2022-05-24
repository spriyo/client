import "./search.css";
import magnifier from "../../assets/Magnifier.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SearchComponent() {
	const navigate = useNavigate();
	const [input, setInput] = useState("");
	const handleKeyDown = (event) => {
		const value = event.target.value;
		if (event.key === "Enter" && value !== "") {
			navigate(`/explore?query=${value}`);
		}
	};

	const onSearch = (event) => {
		if (input !== "") {
			navigate(`/explore?query=${input}`);
		}
	};

	return (
		<div>
			<div className="search-container">
				<input
					type="search"
					id="search"
					onKeyDown={handleKeyDown}
					placeholder="Search"
					value={input}
					onInput={(e) => setInput(e.target.value)}
				/>
				<img src={magnifier} alt="search" height={24} onClick={onSearch} />
			</div>
		</div>
	);
}
