// import Sidebar from "../components/Dashboard/Sidebar";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import RoomsList from "../components/Dashboard/SideBar/RoomsList";
import MembersList from "../components/Dashboard/SideBar/MembersList";
import MainSection from "../components/Dashboard/MainSection/MainSection";
import { RoomType } from "../types/types";
import useLocalStorage from "../hooks/useLocalStorage";

const socket = io("http://localhost:5000");

const Dashboard: React.FC = () => {

	const [userInfo, setUserInfo] = useLocalStorage("user");

	const [messages, setMessages] = useState<string[]>([]);
	const [userId, setUserId] = useState<string>("");
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
				username: "",
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
		socket.emit("joinRoom", {
			room: roomInput,
			// username: id,
		});
	};

	const changeChatHandler = (chatLabel: string, chatId: string, isPrivateDm: Boolean) => {
		setChoosenChat({ label: chatLabel, id: chatId, isPrivateDm: isPrivateDm });
		socket.emit("getChatMessages", { name: chatLabel, roomId: chatId, isPrivateDm: isPrivateDm, username: userId });
	}

	const selectRoomHandler = (room: RoomType) => {
		console.log(room);
	}

	return (
		<div className="container-fluid p-0">
			<div className="row m-0">
				<div className="col-3 p-0 d-flex">
					<RoomsList rooms={rooms} selectRoomHandler={selectRoomHandler} />
					<MembersList users={users} currentUser={{username: userInfo.username, id: userInfo.userId}} />
				</div>
				<div className="col-9 p-0">
					<MainSection />
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
