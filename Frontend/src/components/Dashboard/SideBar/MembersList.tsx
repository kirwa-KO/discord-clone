import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";
import { ReactComponent as RightChevronIcon } from "../../../assets/icons/right-chevron-icon.svg";
import { ChatType, UserType } from "../../../types/types";


const MembersList: React.FC<{
	choosenChat: ChatType;
	users: UserType[];
	currentUser: {
		username: string;
		id: string;
	};
	selectedUserDM: (user: ChatType) => void;
	onlineUsers: string[];
	logoutHandler: () => void;
}> = ({ users, currentUser, choosenChat, selectedUserDM, onlineUsers, logoutHandler }) => {
	return (
		<div className="d-flex h-100vh  flex-column flex-grow-1">
			<div className="d-flex align-items-center flex-grow-1 light-dark-bg overflow-y-scroll flex-column gap-12 pt-4 pb-3 align-items-center px-3">
				<div className="gray-color font-weight-bold mt-2 mb-4 w-100 text-uppercase">
					<RightChevronIcon className="chevron-right" />{" "}
					{choosenChat.name}
				</div>
				{users.map((user: UserType) => {
					if (user.username === currentUser.username) return null;
					return (
						<MemberCard
							onClick={() =>
								selectedUserDM({
									name: user.username,
									_id: user._id,
								})
							}
							key={user._id}
							name={user.username}
							notifications={user.notifications}
							img={`${process.env.REACT_APP_AVATARS_URL}/api/avatar?name=${user.username}`}
							onlineUsers={onlineUsers}
						/>
					);
				})}
			</div>
			<div className="justify-content-between dark-2-bg py-3 px-3 d-flex align-items-center">
				<div className="d-flex gap-8">
					<img
						width={40}
						height={40}
						className="rounded-circle"
						src={`${process.env.REACT_APP_AVATARS_URL}/api/avatar?name=${currentUser.username}`}
						alt=""
					/>
					<div className="d-flex flex-column">
						<span className="small">{currentUser.username}</span>
						<span className="small gray-color">
							#{currentUser.id.substring(0, 5)}
						</span>
					</div>
				</div>
				<LogoutIcon className="cursor-pointer" width={20} height={20} onClick={logoutHandler} />
			</div>
		</div>
	);
};

export default MembersList;

const MemberCard: React.FC<{
	onlineUsers: string[];
	notifications: number | undefined;
	name: string;
	img: string;
	onClick: (user: string) => void;
}> = ({ onlineUsers, notifications, name, img, onClick }) => {
	const isMemberOnline = onlineUsers.includes(name);

	return (
		<div className="d-flex align-items-center w-100 justify-content-between cursor-pointer">
			<div
				className="d-flex gap-12 align-items-center "
				onClick={() => {
					onClick(name);
				}}
			>
				<div className="position-relative">
					{/* <div className="notification-bubble">1</div> */}
					{notifications && notifications > 0 ? (
						<div className="notification-bubble">
							{notifications}
						</div>
					) : null}
					<img
						width={32}
						height={32}
						className="rounded-circle"
						src={img}
						alt=""
					/>
				</div>
				<span>{name}</span>
			</div>
			<div className="d-flex align-items-center gap-8">
				<span className="gray-color">
					{isMemberOnline ? "Online" : "Offline"}
				</span>
				<span className={`${ isMemberOnline ? "online" : "offline"}`}></span>
			</div>
		</div>
	);
};
