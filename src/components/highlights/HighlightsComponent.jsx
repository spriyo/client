import { UsercardComponent } from "../userCard/UsercardComponent";
import "./highlights.css";

export function HighlightsComponent({ title, data = [] }) {
	return (
		<div className="highlights-container">
			<div className="highlights-title">
				<p>{title}</p>
			</div>
			<div>
				{data.slice(0, 6).map((e, i) => (
					<div key={i}>
						<UsercardComponent user={data[i]} />
					</div>
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