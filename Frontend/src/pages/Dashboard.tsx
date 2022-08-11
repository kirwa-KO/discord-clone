import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import RoomsList from "../components/Dashboard/SideBar/RoomsList";
import MembersList from "../components/Dashboard/SideBar/MembersList";
import { ChatType, MessageType, RoomType } from "../types/types";
import useLocalStorage from "../hooks/useLocalStorage";
import { getAllRomsAndUsersApi, getRoomData } from "../services/room";
import { DM_LABEL } from "../utils/constans";
import { getAllUsers } from "../services/user";
import HeaderSection from "../components/Dashboard/MainSection/HeaderSection";
import MessagesSection from "../components/Dashboard/MainSection/MessagesSection";
import MessageInput from "../components/Dashboard/MainSection/MessageInput";

const socket = io("http://10.11.5.5:5000");

const DUMMY_MESSAGES: MessageType[] = [
	{
		_id: "1",
		roomId: "1",
		sendBy: { _id: "ds", username: "Bot" },
		content: "We are so happy to see you here",
		updatedAt: new Date(),
	},
	{
		_id: "2",
		roomId: "1",
		sendBy: { _id: "ds", username: "Bot" },
		content: "you can contact your friends using dm",
		updatedAt: new Date(),
	},
	{
		_id: "3",
		roomId: "1",
		sendBy: { _id: "ds", username: "Bot" },
		content: "And also you can create your own room and chat with your friends",
		updatedAt: new Date(),
	},
];

const createNewMsg = (
	content: string,
	roomId: string,
	userId: string,
	username: string
): MessageType => {
	return {
		_id: Math.random().toString(),
		roomId: roomId,
		sendBy: { _id: userId, username: username },
		content: content,
		updatedAt: new Date(),
	};
};

const Dashboard: React.FC = () => {
	const userInfo = useLocalStorage("user")[0];

	const [messages, setMessages] = useState<MessageType[]>(DUMMY_MESSAGES);
	// const [userId, setUserId] = useState<string>("");
	const [users, setUsers] = useState<any>([]);
	const [rooms, setRooms] = useState<any>([]);
	const [selectedUserDM, setSelectedUserDM] = useState<ChatType>({
		_id: "",
		name: "",
	});
	const [isMemberOfRoom, setIsMemberOfRoom] = useState<boolean>(true);

	// const [choosenChat, setChoosenChat] = useState<any>({
	// 	label: "",
	// 	id: "",
	// 	isPrivateDm: false,
	// });

	const [choosenChat, setChoosenChat] = useState<ChatType>({
		name: DM_LABEL,
		_id: "dm",
	});

	useEffect(() => {
		getAllRomsAndUsersApi()
			.then((roomsUsersData) => {
				setRooms(roomsUsersData.rooms);
				setUsers(roomsUsersData.users);
			})
			.catch((err) => console.log(err));
		socket.on("connect", () => {});

		socket.on("joinedDm", (privateMessages) => {
			setMessages((_) => privateMessages);
		});

		socket.on("receivedMessage", (newMessage) => {
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		});

		socket.on("joinedRoom", (roomName) => {
			console.log(`Congrats you joined: ${roomName}`);
			setIsMemberOfRoom(true);
		});

		socket.on("memberNotInRoom", (roomName) => {
			console.log(`Sorry you are not in: ${roomName}`);
			setIsMemberOfRoom(false);
		});
	}, []);

	const sendMessageHandler = (content: string) => {
		console.log(content);

		if (choosenChat.name === DM_LABEL) {
			socket.emit("sendMessage", {
				content: content,
				room: {...choosenChat, _id: selectedUserDM._id},
				userId: userInfo.userId,
				isPrivateDm: choosenChat.name === DM_LABEL,
			});
		}
		else {
			socket.emit("sendMessage", {
				content: content,
				room: choosenChat,
				userId: userInfo.userId,
			});
		}

		const createdMsg = createNewMsg(
			content,
			choosenChat._id,
			userInfo.userId,
			userInfo.username
		);

		setMessages((prevMessages) => [...prevMessages, createdMsg]);
	};

	const selectRoomHandler = (room: RoomType | string) => {
		if (typeof room === "string") {
			setChoosenChat({ name: room, _id: "" });
			getAllUsers()
				.then((users) => setUsers(users))
				.catch((err) => console.log(err));
			if (isMemberOfRoom === false) {
				setIsMemberOfRoom(true);
			}

			// make user join direct msg room

		} else {
			setChoosenChat({ name: room.name, _id: room._id });
			getRoomData(room.name)
				.then((roomData) => {
					setMessages(roomData.messages);
					setUsers(roomData.members);
				})
				.catch((err) => console.log(err));

			socket.emit("showMyRoom", {
				room: room,
				userId: userInfo.userId,
			});
		}
	};

	const joinRoomHandler = () => {
		console.log(`joinRoomHandler: ${choosenChat.name}`);
		socket.emit("joinRoom", {
			roomName: choosenChat,
			userId: userInfo.userId,
		});
	};

	const selectedUserDMHandler = (user: ChatType) => {
		setSelectedUserDM(user);
		socket.emit("showPrivateMessages", {
			receiverId: user._id,
			userId: userInfo.userId,
		});
	};

	return (
		<div className="container-fluid p-0">
			<div className="row m-0">
				<div className="col-3 p-0 d-flex">
					<RoomsList
						choosenChat={choosenChat}
						rooms={rooms}
						selectRoomHandler={selectRoomHandler}
					/>
					<MembersList
						choosenChat={choosenChat}
						users={users}
						currentUser={{
							username: userInfo.username,
							id: userInfo.userId,
						}}
						selectedUserDM={selectedUserDMHandler}
					/>
				</div>
				<div className="col-9 p-0">
					<div className="d-flex flex-column h-100vh">
						<HeaderSection
							selectedUserDM={selectedUserDM}
							choosenChat={choosenChat}
						/>
						<MessagesSection messages={messages} />
						<MessageInput
							joinRoomHandler={joinRoomHandler}
							choosenChat={choosenChat}
							isMemberOfRoom={isMemberOfRoom}
							sendMessage={sendMessageHandler}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
