import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import RoomsList from "../components/Dashboard/SideBar/RoomsList";
import MembersList from "../components/Dashboard/SideBar/MembersList";
import { ChatType, MessageType, RoomType, UserType } from "../types/types";
import useLocalStorage, { removeLocalItem } from "../hooks/useLocalStorage";
import { getAllRomsAndUsersApi, getRoomData } from "../services/room";
import { DM_LABEL } from "../utils/constans";
import { getAllUsers } from "../services/user";
import HeaderSection from "../components/Dashboard/MainSection/HeaderSection";
import MessagesSection from "../components/Dashboard/MainSection/MessagesSection";
import MessageInput from "../components/Dashboard/MainSection/MessageInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const socket = io(`${process.env.REACT_APP_WEBSITE_URL}`);

const DUMMY_MESSAGES: { [key: string]: MessageType[] } = {
	botRoom: [
		{
			_id: "1",
			roomId: "1",
			sendBy: { _id: "ds", username: "Bot 🤖" },
			content: "We are so happy to see you here",
			updatedAt: new Date(),
		},
		{
			_id: "2",
			roomId: "1",
			sendBy: { _id: "ds", username: "Bot 🤖" },
			content: "you can contact your friends using dm",
			updatedAt: new Date(),
		},
		{
			_id: "3",
			roomId: "1",
			sendBy: { _id: "ds", username: "Bot 🤖" },
			content:
				"And also you can create your own room and chat with your friends",
			updatedAt: new Date(),
		},
	],
};
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
	const [userInfo, setUserInfo] = useLocalStorage("user");

	const [messages, setMessages] = useState<{ [key: string]: MessageType[] }>(
		DUMMY_MESSAGES
	);
	const [users, setUsers] = useState<any>([]);
	const [rooms, setRooms] = useState<any>([]);
	const [selectedUserDM, setSelectedUserDM] = useState<ChatType>({
		_id: "",
		name: "",
	});
	const [isMemberOfRoom, setIsMemberOfRoom] = useState<boolean>(true);
	const [choosenChat, setChoosenChat] = useState<ChatType>({
		name: DM_LABEL,
		_id: "",
	});
	const chatroomref = useRef(choosenChat);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

	const navigate = useNavigate();

	const addUserNotification = (roomId: string) => {
		setUsers((prevUsers: any) => {
			const users = prevUsers.map((user: UserType) => {
				if (user._id === roomId) {
					user.notifications = user.notifications
						? user.notifications + 1
						: 1;
					return user;
				}
				return user;
			});

			return [...users];
		});
	};

	const addRoomNotification = (roomId: string) => {
		setRooms((prevRooms: any) => {
			const rooms = prevRooms.map((room: RoomType) => {
				if (room._id === roomId) {
					room.notifications = room.notifications
						? room.notifications + 1
						: 1;

					return room;
				}
				return room;
			});
			return [...rooms];
		});
	};

	const addPrivateDmMessage = (roomId: string, newMessage: any) => {
		setMessages((prevMessages) => {
			if (prevMessages[roomId]) {
				return {
					...prevMessages,
					[roomId]: [...prevMessages[roomId], newMessage],
				};
			}
			return {
				...prevMessages,
				[roomId]: [newMessage],
			};
		});
	};

	const addRoomMessage = (roomId: string, newMessage: any) => {
		setMessages((prevMessages) => {
			if (prevMessages[roomId]) {
				return {
					...prevMessages,
					[roomId]: [...prevMessages[roomId], ...newMessage],
				};
			}
			return {
				...prevMessages,
				[roomId]: newMessage,
			};
		});
	};

	const addMessageInRoomOrPrivateDM = (
		roomId: string,
		newMessage: any,
		isRoomMesages: boolean = false,
		isPrivateDm: boolean = false
	) => {
		if (isRoomMesages === false) {
			if (roomId !== chatroomref.current._id) {
				if (isPrivateDm === true) addUserNotification(roomId);
				else addRoomNotification(roomId);
			}
			addPrivateDmMessage(roomId, newMessage);
		} else {
			addRoomMessage(roomId, newMessage);
		}
	};

	useEffect(() => {
		getAllRomsAndUsersApi()
			.then((roomsUsersData) => {
				setRooms(roomsUsersData.rooms);
				setUsers(roomsUsersData.users);
			})
			.catch((err) => console.log(err));

		socket.on("connect", () => {
			socket.emit("AddConnectedUser", { username: userInfo.username });
		});

		socket.on("joinedDm", ({ messages: privateMessages, receiverId }) => {
			setMessages((prevMessages) => ({
				...prevMessages,
				[receiverId]: privateMessages,
			}));
		});

		socket.on(
			"receivedMessage",
			({ createdMessage: newMessage, roomId, isPrivateDm }) => {
				addMessageInRoomOrPrivateDM(
					roomId,
					newMessage,
					false,
					isPrivateDm
				);
			}
		);

		socket.on("joinedRoom", ({roomName, user}) => {
			console.log(`Congrats you joined: ${roomName}`);
			setIsMemberOfRoom(_ => true);
			if (roomName === chatroomref.current.name)
				setUsers((prevUsers: any) => [...prevUsers, user]);
		});

		socket.on("memberNotInRoom", (roomName) => {
			console.log(`Sorry you are not in: ${roomName}`);
			setIsMemberOfRoom(false);
		});

		socket.on("createdRoom", (roomData) => {
			// console.log(roomData);
			setRooms((prevRooms: any) => [...prevRooms, roomData]);
		});

		socket.on("connectedUsers", (onlineUsers) => {
			setOnlineUsers(onlineUsers);
		})

	}, []);

	useEffect(() => {
		chatroomref.current = choosenChat;
	}, [choosenChat]);


	const logoutHandler = () => {
		socket.emit("logout", {
			username: userInfo.username,
			userId: userInfo.userId,
		});

		toast.success("Logout success !!", {
			position: toast.POSITION.TOP_CENTER,
		});
		
		removeLocalItem("user");
		setUserInfo("");
	}

	const sendMessageHandler = (content: string) => {
		if (choosenChat.name === DM_LABEL) {
			socket.emit("sendMessage", {
				content: content,
				room: { ...choosenChat, _id: selectedUserDM._id },
				userId: userInfo.userId,
				isPrivateDm: choosenChat.name === DM_LABEL,
			});
		} else {
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

		addMessageInRoomOrPrivateDM(choosenChat._id, createdMsg);
	};

	const selectRoomHandler = (room: RoomType | string) => {
		if (typeof room === "string") {
			setChoosenChat(() => ({ name: room, _id: "" }));
			setSelectedUserDM({ _id: "", name: DM_LABEL });
			getAllUsers()
				.then((users) => setUsers(users))
				.catch((err) => console.log(err));
			if (isMemberOfRoom === false) {
				setIsMemberOfRoom(true);
			}
		} else {
			setChoosenChat(() => ({ name: room.name, _id: room._id }));

			getRoomData(room.name)
				.then((roomData) => {
					setRooms((prevRooms: any) => {
						const rooms = prevRooms.map((room: RoomType) => {
							if (room._id === roomData._id) {
								room.notifications = 0;
							}
							return room;
						});
						return [...rooms];
					});
					addMessageInRoomOrPrivateDM(
						room._id,
						roomData.messages,
						true
					);
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
		setIsMemberOfRoom(true);
		socket.emit("joinRoom", {
			roomName: choosenChat.name,
			userId: userInfo.userId,
		});
	};

	if (userInfo === null || (typeof userInfo === "string" && userInfo === "")) {
		navigate("/login");
		return <div>logout....</div>;
	}

	const selectedUserDMHandler = (user: ChatType) => {
		setSelectedUserDM(user);
		setChoosenChat(() => ({ name: DM_LABEL, _id: user._id }));

		setUsers((prevUsers: any) => {
			const users = prevUsers.map((currUser: UserType) => {
				if (currUser._id === user._id) {
					currUser.notifications = 0;
					return currUser;
				}
				return currUser;
			});

			return [...users];
		});

		socket.emit("showPrivateMessages", {
			receiverId: user._id,
			userId: userInfo.userId,
		});
	};

	const getNumberOfDmNotifications = (): number => {
		let numberOfNotifications = 0;

		users.map((user: UserType) => {
			if (user.notifications && user.notifications > 0) {
				numberOfNotifications += user.notifications;
			}
			return null;
		});

		return numberOfNotifications;
	};

	const createRoomHandler = (roomName: string) => {
		console.log(`createRoomHandler: ${roomName}`);
		socket.emit("createRoom", {
			roomName: roomName,
			userId: userInfo.userId,
		});
	};

	return (
		<div className="container-fluid p-0">
			<div className="row m-0">
				<div className="col-3 p-0 d-flex position-static">
					<RoomsList
						choosenChat={choosenChat}
						rooms={rooms}
						selectRoomHandler={selectRoomHandler}
						dmNotifications={getNumberOfDmNotifications()}
						createRoomHandler={createRoomHandler}
					/>
					<MembersList
						choosenChat={choosenChat}
						users={users}
						currentUser={{
							username: userInfo.username,
							id: userInfo.userId,
						}}
						onlineUsers={onlineUsers}
						selectedUserDM={selectedUserDMHandler}
						logoutHandler={logoutHandler}
					/>
				</div>
				<div className="col-9 p-0">
					<div className="d-flex flex-column h-100vh">
						<HeaderSection
							selectedUserDM={selectedUserDM}
							choosenChat={choosenChat}
						/>
						{choosenChat.name === DM_LABEL &&
							choosenChat._id === "" && (
								<MessagesSection messages={messages.botRoom} />
							)}
						{choosenChat.name === DM_LABEL &&
							choosenChat._id !== "" &&
							messages[choosenChat._id] && (
								<MessagesSection
									messages={messages[choosenChat._id]}
								/>
							)}
						{choosenChat.name !== DM_LABEL &&
							messages[choosenChat._id] && (
								<MessagesSection
									messages={messages[choosenChat._id]}
								/>
							)}
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
