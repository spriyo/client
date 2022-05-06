import { useNavigate } from "react-router-dom";

const styles = {
	backgroundColor: "#00c775",
	color: "white",
	borderRadius: "8px",
	padding: "4px 8px",
	margin: "0px 16px",
	cursor: "pointer",
};

export function CreateComponent() {
	const navigate = useNavigate();

	return (
		<div>
			<div
				onClick={(event) => {
					event.preventDefault();
					navigate("/create");
				}}
				style={styles}
			>
				<p>Create</p>
			</div>
		</div>
	);
}
