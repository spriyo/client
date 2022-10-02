import React, { useEffect } from "react";
import { useState } from "react";
import { Box } from "@mui/material";
import { RiImageAddLine } from "react-icons/ri";

export const ImportFile = ({
	onFileChange,
	width = "100px",
	height = "100px",
	borderRadius = "8px",
}) => {
	const [file, setFile] = useState(null);
	const [imageUrl, setImageUrl] = useState();
	const randomNumber = Math.random()

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
		<Box
			sx={{
				border: "3px solid grey",
				borderStyle: "dashed",
				width: "fit-content",
				p: "4px",
				borderRadius,
				"&:hover": { backgroundColor: "lightgrey" },
			}}
		>
			<label htmlFor={`${randomNumber}-file-upload`}>
				<Box
					style={{
						backgroundImage: file
							? file.type === "video/mp4"
								? "none"
								: `url(${file ? imageUrl : ""})`
							: "none",
						backgroundPosition: "center",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						textAlign: "center",
						height,
						width,
						cursor: "pointer",
					}}
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
								height={height}
								width={width}
								margin={0}
								muted
								loop
							></video>
						) : (
							""
						)
					) : (
						<Box
							sx={{
								width: "100%",
								height: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<RiImageAddLine
								style={{ color: "grey", width: "50px", height: "50px" }}
							/>
						</Box>
					)}
				</Box>
				<input
					type="file"
					name="Asset"
					id={`${randomNumber}-file-upload`}
					onChange={onchange}
					style={{ display: "none" }}
				/>
			</label>
		</Box>
	);
};
