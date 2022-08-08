// import Sidebar from "../components/Dashboard/Sidebar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Dashboard: React.FC<{ id: String }> = ({ id }) => {
	const [messages, setMessages] = useState<String[]>([]);
	const [userId, setUserId] = useState<String>(id);
	const [messageInput, setMessageInput] = useState<any>("");
	const [roomInput, setRoomInput] = useState<any>("");
	const [users, setUsers] = useState<any>([]);
	const [rooms, setRooms] = useState<any>([]);
	const [choosenChat, setChoosenChat] = useState<any>({
		label: "",
		id: "",
		isPrivateDm: false,
	});

	useEffect(() => {
		socket.on("connect", () => {
			// setSocketId(socket.id);
			// console.log(id);
			socket.emit("addUser", {
				username: id,
			});
		});
		socket.on("getChats", (rooms, users) => {
			setRooms(rooms);
			setUsers(users);
		});
		socket.on("receivedMessage", (data) => {
			console.log(data);
			setMessages((prevMessages) => [...prevMessages, data]);
		});
		socket.on("joinedRoom", (roomName) => {
			console.log(`Congrats you joined: ${roomName}`);
		});
		socket.on("userAdded", user => {
			// console.log(`user: ${user._id}`);
			setUserId(user._id);
		})
		socket.on("receivedMessages", receivedMessages => {
			console.log(receivedMessages);
			setMessages(_ => receivedMessages.map((msg: any) => msg.message));
		})
	}, []);

	const sendMessageHandler = () => {
		socket.emit("sendMessage", {
			message: messageInput,
			room: choosenChat,
			username: userId,
		});
		setMessages((prevMessages) => [...prevMessages, messageInput]);
	};

	const sendRoomHandler = () => {
		// socket.emit("joinRoom", {
		// 	room: roomInput,
		// 	username: id,
		// });
	};

	const changeChatHandler = (chatLabel: String, chatId: String, isPrivateDm: Boolean) => {
		setChoosenChat({ label: chatLabel, id: chatId, isPrivateDm: isPrivateDm });
		socket.emit("getChatMessages", { name: chatLabel, roomId: chatId, isPrivateDm: isPrivateDm, username: userId });
	}

	return (
		<div className="container">
			<div className="row">
				<div className="col-7 mt-4">
					<div
						className="bg-dark py-4 px-4"
						style={{ color: "white" }}
					>
						<p className="mb-0">
							You have connected with id: {id}
						</p>
						<p className="mt-2 mb-0">
							You are in chat: {choosenChat.label}
						</p>
					</div>
					<div className="messages">
						{messages.map((message, index) => (
							<div key={index} className="pt-2 px-4">
								{message}
							</div>
						))}
					</div>

					<div className="row mt-4 m-0">
						{/* <div className="d-flex align-items-center col-1">
							<p className="m-0">Message</p>
						</div> */}
						<input
							placeholder="message to send"
							type="text"
							className="col-9"
							value={messageInput}
							onChange={(e) => setMessageInput(e.target.value)}
						/>
						<button
							onClick={sendMessageHandler}
							className="offset-1 col-2 btn btn-primary"
						>
							Send
						</button>
					</div>

					<div className="row mt-4 m-0">
						{/* <div className="d-flex align-items-center col-1">
							<p className="m-0">Room</p>
						</div> */}
						<input
							placeholder="room to join"
							type="text"
							className="col-9"
							value={roomInput}
							onChange={(e) => setRoomInput(e.target.value)}
						/>
						<button
							onClick={sendRoomHandler}
							className="offset-1 col-2 btn btn-warning"
						>
							Join
						</button>
					</div>
				</div>
				<div className="col-5 mt-4">
					{users.map((user: any, index: number) => (
						<div
							className={`d-flex align-items-center justify-content-between mb-4 rounded py-2 px-4 ${user.username === id ? "bg-primary" : "bg-dark"}`}
							key={`user-${index}`}
							style={{ cursor: "pointer", color: "white" }}
							onClick={() => changeChatHandler(user.username, user._id, true)}
						>
							<div>
								<img
									width={40}
									height={40}
									className="img-fluid rounded-circle"
									src={`https://myanimelist.tech/api/avatar?name=${user.username}`}
									alt="avatr"
								/>
								<span className="ml-3 h6 mb-0 font-weight-bold">
									{user.username}
								</span>
							</div>
							<span className="h6 mb-0 font-weight-bold">
							{ user.username === id ? "[Me]" : "[DM]" }
							</span>
						</div>
					))}
					{rooms.map((room: any, index: number) => (
						<div
							className="d-flex align-items-center justify-content-between mb-4 bg-dark rounded py-2 px-4"
							key={`room-${index}`}
							style={{ cursor: "pointer", color: "white" }}
							onClick={() => changeChatHandler(room.name, room._id, false)}
						>
							<div>
								<img
									width={40}
									height={40}
									className="img-fluid rounded-circle"
									src={`https://myanimelist.tech/api/avatar?name=${room.name}`}
									alt="avatr"
								/>
								<span className="ml-3 h6 mb-0 font-weight-bold">
									{room.name.substring(0, 7)}
								</span>
							</div>
							<span className="h6 mb-0 font-weight-bold">
								[ROOM]
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
