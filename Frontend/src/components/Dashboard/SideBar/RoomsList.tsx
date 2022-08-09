import { ReactComponent as DmIcon } from "../../../assets/icons/dm-icon.svg";
import { ReactComponent as AddIcon } from "../../../assets/icons/add-icon.svg";
import { RoomType } from "../../../types/types";

const RoomsList: React.FC<{
	rooms: RoomType[];
	selectRoomHandler: (room: RoomType) => void;
}> = ({ rooms, selectRoomHandler }) => {
	return (
		<div className="d-flex dark-bg flex-column overflow-y-scroll gap-12 py-2 align-items-center h-100vh px-3">
			<DmIcon className="cursor-pointer" />
			<div className="line-sperator" />
			{
				rooms.map((room: RoomType) => (
					<RoomCard room={room} onClick={selectRoomHandler} key={room._id} />
				))
			}
			<div className="line-sperator" />
			<AddIcon className="cursor-pointer" />
		</div>
	);
};

export default RoomsList;

const RoomCard: React.FC<{ room: RoomType, onClick: (room: RoomType) => void; }> = ({ room, onClick }) => {
	return (
		<img
			onClick={onClick.bind(null, room)}
			className="rounded-circle cursor-pointer"
			width={48}
			height={48}
			src={`https://myanimelist.tech/api/avatar?name=${room.name}`}
			alt=""
		/>
	);
};
