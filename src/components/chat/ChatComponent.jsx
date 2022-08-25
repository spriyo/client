import "./ChatComponent.css";
import {
	Box,
	InputAdornment,
	TextField,
	Typography,
	Stack,
	Button,
} from "@mui/material";
import { RiSendPlane2Fill } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatImage from "../../lottie/106068-chat.gif";
import { ChatHttpService } from "../../api/chat";
const ENDPOINT = process.env.REACT_APP_CHAT_WS_SERVER_URL;

export const ChatComponent = () => {
	let socketInitailized = false;
	const [ws, setWs] = useState(null);
	const [value, setValue] = useState("");
	const [isChatLoaded, setIsChatLoaded] = useState(false);
	const user = useSelector((state) => state.authReducer.user);
	const [messages, setMessages] = useState([]);
	const [activeUsers, setActiveUsers] = useState(0)
	const chatHttpService = new ChatHttpService();

	const webSocket = () => {
		const webSocketClient = new WebSocket(ENDPOINT);

		webSocketClient.onopen =async function (connection) {
			const user = localStorage.getItem("user");
			webSocketClient.send(
				JSON.stringify({
					type: "info",
					message: "welcome",
					user,
				})
			);
			setIsChatLoaded(true);
			const usersResolved = await getActiveUsers();
			setActiveUsers(usersResolved.data.users)

			// console.log("WebSocket Client Connected");
			connection.onerror = function (error) {
				console.log("Connection Error: " + error.toString());
			};
			connection.onclose = function () {
				console.log("echo-protocol Connection Closed");
			};
		};

		webSocketClient.onmessage = function (message) {
			const data = JSON.parse(message.data);
			console.log(...messages);
			if (data.type === "message") {
				setMessages((mes) => [
					...mes,
					{
						message: data.message,
						user: data.user,
						createdAt: new Date(),
					},
				]);
			}
		};

		webSocketClient.onclose = function (message) {
			const wSocket = webSocket();
			setWs(wSocket);
		};

		return webSocketClient;
	};

	function getRandomColor(id) {
		var color = ((id.length * id.charCodeAt(0) * 0xfff) << 0).toString(16);
		return color;
	}

	const sendValue = (message) => {
		if (value === "" && message === null) return;
		ws.send(
			JSON.stringify({
				type: "message",
				message: message ?? value,
				user,
			})
		);
		setValue("");
	};

	async function getActiveUsers() {
		const resolved = await chatHttpService.getActiveUsers();
		return resolved;
	}

	const messageEl = useRef(null);

	useEffect(() => {
		if (socketInitailized) return;
		setTimeout(() => {
			const wSocket = webSocket();
			setWs(wSocket);
		}, 1000);
		socketInitailized = true;

		if (messageEl) {
			messageEl.current.addEventListener("DOMNodeInserted", (event) => {
				const { currentTarget: target } = event;
				target.scroll({ top: target.scrollHeight, behavior: "smooth" });
			});
		}
	}, []);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			{/* Message Container */}
			<Box className="scroll-body" ref={messageEl}>
				{messages.length === 0 ? (
					<Box
						height="100%"
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							flexDirection: "column",
						}}
					>
						<img
							src={ChatImage}
							height="150px"
							width="150px"
							alt="Chat Image"
						/>
						{isChatLoaded ? (
							<Box>
								<Button
									variant="outlined"
									size="small"
									onClick={() => {
										sendValue("#WAGMI🚀");
									}}
								>
									Wagmi🚀?
								</Button>
								<Stack direction={"row"} alignItems={"center"} m={1}>
									<Box className="blinking-green"></Box>
									<Typography ml={0.4} variant="h6">
										{`${activeUsers} Online`}
									</Typography>
								</Stack>
							</Box>
						) : (
							<p>loading</p>
						)}
					</Box>
				) : (
					messages &&
					messages.map((m, i) => {
						let user = m.user ?? { username: "anonymous" };
						return (
							<Stack
								key={i}
								sx={{
									p: 0.3,
									pl: 0.4,
									borderRadius: "4px",
									flexDirection: "row",
									alignItems: "start",
									"&:hover": {
										bgcolor: "rgb(209 207 207 / 43%)",
										cursor: "hover",
									},
								}}
							>
								<Typography
									sx={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#" + getRandomColor(user.username),
									}}
								>
									{`${user.username}:`}&nbsp;
								</Typography>
								<Typography
									sx={{
										fontSize: "12px",
										fontWeight: "600",
									}}
								>
									{m.message}
								</Typography>
							</Stack>
						);
					})
				)}
			</Box>
			{/* Message Box */}
			{isChatLoaded && (
				<Box sx={{ mt: 1 }}>
					<TextField
						fullWidth
						placeholder="Send a message"
						size="small"
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment
									sx={{
										cursor: "pointer",
									}}
									position="start"
								>
									<RiSendPlane2Fill onClick={sendValue} />
								</InputAdornment>
							),
						}}
						onKeyDown={(event) => {
							if (event.key === "Enter") sendValue();
						}}
					/>
				</Box>
			)}
		</Box>
	);
};
