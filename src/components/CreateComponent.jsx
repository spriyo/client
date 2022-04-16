import { useState } from "react";
import Modal from "react-modal";
import { CreateScreen } from "../screens/create/CreateScreen";

const styles = {
	backgroundColor: "#00c775",
	color: "white",
	borderRadius: "8px",
	padding: "4px 8px",
	margin: "0px 16px",
	cursor: "pointer",
};

Modal.setAppElement("#root");

export function CreateComponent() {
	const [modalIsOpen, setModalIsOpen] = useState(false);

	function closeModal() {
		setModalIsOpen(false);
	}

	return (
		<div>
			<div
				onClick={() => {
					setModalIsOpen(true);
				}}
				style={styles}
			>
				<p>Create</p>
			</div>
			<Modal
				style={{
					overlay: {
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(00,00,00,0.24)",
					},
					content: {
						width: "75vw",
						height: "85vh",
						inset: "unset",
					},
				}}
				isOpen={modalIsOpen}
			>
				<CreateScreen closeModal={closeModal} />
			</Modal>
		</div>
	);
}
