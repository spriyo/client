import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { AiOutlineUpload } from "react-icons/ai";

export const AddFile = ({ onFileChange }) => {
	const [imageUrl, setImageUrl] = useState();
	const [file, setFile] = useState(null);

	function dragOverHandler(ev) {
		ev.preventDefault();
	}

	function dropHandler(ev) {
		ev.preventDefault();
		// Limit 1 File
		if (ev.dataTransfer.items.length > 1 || ev.dataTransfer.files > 1) {
			return alert("Please upload one file");
		}

		if (ev.dataTransfer.items) {
			for (let i = 0; i < ev.dataTransfer.items.length; i++) {
				if (ev.dataTransfer.items[i].kind === "file") {
					const f = ev.dataTransfer.items[i].getAsFile();
					const validFile = checkFileType(f.name);
					if (!validFile) return;
					console.log(f);
					setFile(f);
				}
			}
		} else {
			for (let i = 0; i < ev.dataTransfer.files.length; i++) {
				const validFile = checkFileType(ev.dataTransfer.files[i].name);
				if (!validFile) return;
				setFile(ev.dataTransfer.files[i]);
			}
		}
	}

	async function onchange(e) {
		try {
			const f = e.target.files[0];
			if (!f) return;
			const validFile = checkFileType(f.name);
			if (!validFile) return;
			setFile(f);
			onFileChange(f);
		} catch (error) {
			console.log("Error uploading file: ", error);
		}
	}

	function checkFileType(filename) {
		// Ad obj for 3D file upload
		if (!filename.match(/\.(jpg|jpeg|png|mp4)$/)) {
			alert("Please upload only image or video file.");
			return false;
		} else {
			return true;
		}
	}

	useEffect(() => {
		if (file) setImageUrl(URL.createObjectURL(file));
	}, [file]);

	return (
		<Box>
			{/* Image */}
			<Box className="image-container" sx={{ alignItems: "start" }}>
				<Stack>
					<Box className="title">
						<p>Upload your images</p>
					</Box>
					<Box>
						<p>PNG, JPG, and MP4 files are allowed</p>
					</Box>
				</Stack>
				<label htmlFor="file-upload">
					<Box
						className="image-dropper"
						style={{
							backgroundImage: file
								? file.type === "video/mp4"
									? "none"
									: `url(${file ? imageUrl : ""})`
								: "none",
							backgroundPosition: "center",
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							height: "200px",
							textAlign: "center",
							marginTop: "12px",
							width: "50vw",
							maxWidth: "400px",
							minWidth: "200px",
						}}
						onClick={(e) => (file ? window.open(imageUrl, "_blank") : "")}
						onDrop={(e) => dropHandler(e)}
						onDragOver={(e) => dragOverHandler(e)}
					>
						{file ? (
							file.type === "video/mp4" ? (
								<video
									src={URL.createObjectURL(
										new Blob([file], { type: "video/mp4" })
									)}
									autoPlay
									height={"200px"}
									width={"280px"}
									muted
									loop
								></video>
							) : (
								""
							)
						) : (
							"Drag & drop"
						)}
					</Box>
					<Box className="image-picker">
						<Box>
							<AiOutlineUpload />
							<p>{file ? "Change File" : "Upload File"}</p>
							<input
								type="file"
								name="Asset"
								className="my-4"
								id="file-upload"
								onChange={onchange}
							/>
						</Box>
					</Box>
				</label>
			</Box>
		</Box>
	);
};
