import { ReactComponent as DmIcon } from "../../../assets/icons/dm-icon.svg";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { ChatType, RoomType } from "../../../types/types";
import { DM_LABEL } from "../../../utils/constans";

const RoomsList: React.FC<{
	rooms: RoomType[];
	selectRoomHandler: (room: RoomType | string) => void;
	choosenChat: ChatType;
}> = ({ rooms, selectRoomHandler, choosenChat }) => {
	return (
		<div className="d-flex dark-bg flex-column overflow-y-scroll gap-12 py-2 align-items-center h-100vh px-3">
			<div className={`${ choosenChat.name === DM_LABEL ? "active-room" : ""}`}>
				<DmIcon className="cursor-pointer" onClick={selectRoomHandler.bind(null, DM_LABEL)} />
			</div>
			<div className="line-sperator" />
			{
				rooms.map((room: RoomType) => (
					<RoomCard choosenChat={choosenChat} room={room} onClick={selectRoomHandler} key={room._id} />
				))
			}
			<div className="line-sperator" />
			<AddIcon className="cursor-pointer" />
		</div>
	);
};

export default RoomsList;

const RoomCard: React.FC<{ choosenChat: ChatType, room: RoomType, onClick: (room: RoomType) => void; }> = ({ room, onClick, choosenChat }) => {
	return (
		<div className={`${ choosenChat.name === room.name ? "active-room" : ""}`}>
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
