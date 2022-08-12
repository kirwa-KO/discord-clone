import { ReactComponent as DmIcon } from "../../../assets/icons/dm-icon.svg";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { ChatType, RoomType } from "../../../types/types";
import { DM_LABEL } from "../../../utils/constans";
import { useRef, useState } from "react";

const RoomsList: React.FC<{
	rooms: RoomType[];
	selectRoomHandler: (room: RoomType | string) => void;
	choosenChat: ChatType;
	dmNotifications: number;
	createRoomHandler: (roomName: string) => void;
}> = ({
	rooms,
	selectRoomHandler,
	choosenChat,
	dmNotifications,
	createRoomHandler,
}) => {
	const roomInputRef = useRef<HTMLInputElement>(null);

	const [showCreateRoomForm, setShowCreateRoomForm] = useState(false);

	const submitCreateRoomForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createRoomHandler(roomInputRef.current!.value);
		setShowCreateRoomForm(false);
	};

	const showCreateRoomFormHandler = () => {
		setShowCreateRoomForm(!showCreateRoomForm);
	};

	return (
		<>
			<div className="d-flex dark-bg flex-column overflow-y-scroll gap-12 py-2 align-items-center h-100vh px-3">
				<div
					className={`${
						choosenChat.name === DM_LABEL ? "active-room" : ""
					} position-relative`}
				>
					{dmNotifications > 0 && (
						<div className="notification-bubble">
							{dmNotifications}
						</div>
					)}
					<DmIcon
						className="cursor-pointer"
						onClick={selectRoomHandler.bind(null, DM_LABEL)}
					/>
				</div>
				<div className="line-sperator" />
				{rooms.map((room: RoomType, index: number) => (
					<RoomCard
						choosenChat={choosenChat}
						room={room}
						onClick={selectRoomHandler}
						key={room._id + index}
					/>
				))}
				<div className="line-sperator" />
				<AddIcon
					className="cursor-pointer"
					onClick={showCreateRoomFormHandler}
				/>
				{showCreateRoomForm && (
					<form
						onSubmit={submitCreateRoomForm}
						className="create-room-form"
					>
						<input
							ref={roomInputRef}
							type="text"
							className="main-input"
							placeholder="Room name"
						/>
						<button className="btn main-btn mt-3">
							Create Room
						</button>
						<button
							onClick={showCreateRoomFormHandler}
							type="button"
							className="btn danger-btn mt-3"
						>
							Cancel
						</button>
					</form>
				)}
			</div>
		</>
	);
};

export default RoomsList;

const RoomCard: React.FC<{
	choosenChat: ChatType;
	room: RoomType;
	onClick: (room: RoomType) => void;
}> = ({ room, onClick, choosenChat }) => {
	return (
		<div
			className={`${
				choosenChat.name === room.name ? "active-room" : ""
			} position-relative`}
		>
			{room.notifications && room.notifications > 0 ? (
				<div className="notification-bubble">{room.notifications}</div>
			) : null}
			<img
				onClick={onClick.bind(null, room)}
				className="border-r-10 cursor-pointer "
				width={48}
				height={48}
				src={`${process.env.REACT_APP_AVATARS_URL}/api/avatar?name=${room.name}`}
				alt=""
			/>
		</div>
	);
};
