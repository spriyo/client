import {
	Avatar,
	Box,
	Dialog,
	DialogTitle,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AuthHttpService } from "../api/auth";
import { store } from "../state/store";
import { ButtonComponent } from "./ButtonComponent";
import { MdOutlineModeEditOutline } from "react-icons/md";

export const SettingComponent = ({ open, onClose }) => {
	var authReducer = store.getState().authReducer;
	const authHttpService = new AuthHttpService();
	const [loading, setLoading] = useState(false);
	const [formInput, updateFormInput] = useState({
		username: "",
		displayName: "",
	});

	const handleClose = () => {
		onClose();
	};

	async function save() {
		if (loading) return;
		const { username, displayName } = formInput;
		console.log(formInput);
		if (!username || !displayName)
			return alert("Please ensure everything is filled.");
		setLoading(true);
		const resolved = await authHttpService.updateProfile(formInput);
		if (resolved.error) {
			const message = resolved.data.data.message;
			if (message.includes("username not valid")) {
				alert("Enter valid username");
			}
		} else {
			alert("Profile updated");
		}
		setLoading(false);
	}

	async function onImageUpdate(e) {
		if (loading) return;
		setLoading(true);
		try {
			const file = e.target.files[0];
			if (!file) return;
			var formData = new FormData();
			formData.append("displayimg", file);
			const resolved = await authHttpService.updateAvatar(formData);
			if (!resolved.error) {
				alert("Avatar updated");
				window.location.reload();
			}
		} catch (error) {
			console.log("Unable to upload avatar", error);
		}
		setLoading(false);
	}

	useEffect(() => {
		if (authReducer.user) {
			updateFormInput({
				username: authReducer.user.username,
				displayName: authReducer.user.displayName,
			});
		}
	}, [authReducer]);

	return (
		<Box>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle>Profile Settings</DialogTitle>
				{!authReducer.user ? (
					<Typography variant="h6" textAlign="center">
						Loading...
					</Typography>
				) : (
					<Box
						p={2}
						display={"flex"}
						alignItems="center"
						flexDirection="column"
					>
						{/* Profile Update */}
						<Box pb={2} position="relative">
							<Avatar
								alt="Profile Image"
								src={authReducer.user.displayImage}
								sx={{ width: 56, height: 56 }}
							/>
							<label htmlFor="file-upload" className="custom-file-upload">
								<input
									type="file"
									name="Asset"
									id="file-upload"
									onChange={onImageUpdate}
									style={{ display: "none" }}
								/>
								<Box
									position="absolute"
									sx={{ bottom: "8px", right: "-8px", cursor: "pointer" }}
								>
									<MdOutlineModeEditOutline size="25" />
								</Box>
							</label>
						</Box>
						<Box pb={2}>
							{/* Username */}
							<TextField
								id="username"
								label="Username"
								defaultValue={authReducer.user.username}
								helperText="Enter your username"
								size="small"
								onChange={(e) =>
									updateFormInput({ ...formInput, username: e.target.value })
								}
							/>
						</Box>
						{/* Display Name */}
						<Box pb={2}>
							{/* Username */}
							<TextField
								id="displayname"
								label="Display Name"
								defaultValue={authReducer.user.displayName}
								helperText="Enter your name"
								size="small"
								onChange={(e) =>
									updateFormInput({ ...formInput, displayName: e.target.value })
								}
							/>
						</Box>
						<ButtonComponent
							filled="true"
							text="Save"
							size="small"
							onClick={save}
						/>
					</Box>
				)}
			</Dialog>
		</Box>
	);
};
