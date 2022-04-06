import { UserCardComponent } from "../userCard/userCard";
import "./highlights.css";

export function HighlightsComponent({ title, data = [] }) {
	return (
		<div className="highlights-container">
			<div className="highlights-title">
				<p>{title}</p>
			</div>
			<div>
				{data.slice(0, 6).map((e) => (
					<UserCardComponent />
				))}
			</div>
			{data.length > 5 ? (
				<div className="collection-action">See all</div>
			) : (
				<div></div>
			)}
		</div>
	);
}
