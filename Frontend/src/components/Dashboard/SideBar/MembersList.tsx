import { ReactComponent as CogIcon } from "../../../assets/icons/cog.svg";
import { ReactComponent as RightChevronIcon } from "../../../assets/icons/right-chevron-icon.svg";
import { ChatType, UserType } from "../../../types/types";

const MembersList: React.FC<{
	choosenChat: ChatType;
	users: UserType[],
	currentUser: {
		username: string,
		id: string
	},
	selectedUserDM: (user: ChatType) => void
}> = ({
	users,
	currentUser,
	choosenChat,
	selectedUserDM
}) => {
	return (
		<div className="d-flex h-100vh  flex-column flex-grow-1">
			<div className="d-flex align-items-center flex-grow-1 light-dark-bg overflow-y-scroll flex-column gap-12 pt-4 pb-3 align-items-center px-3">
				<div className="gray-color font-weight-bold mt-2 mb-4 w-100 text-uppercase"><RightChevronIcon className="chevron-right" /> {choosenChat.name}</div>
				{
					users.map((user: UserType) => (
						<MemberCard
							onClick={() => selectedUserDM({ name: user.username, _id: user._id })}
							key={user._id}
							name={user.username}
							img={`${process.env.REACT_APP_AVATARS_URL}/api/avatar?name=${user.username}`}
						/>
					))
				}
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
						<span className="small gray-color">#{currentUser.id.substring(0, 5)}</span>
					</div>
				</div>
				<CogIcon />
			</div>
		</div>
	);
};

export default MembersList;

const MemberCard: React.FC<{ name: string; img: string, onClick: (user: string) => void }> = ({ name, img, onClick }) => {
	return (
		<div className="d-flex align-items-center w-100 justify-content-between cursor-pointer">
			<div className="d-flex gap-12 align-items-center " onClick={() => {onClick(name)}}>
				<img
					width={32}
					height={32}
					className="rounded-circle"
					src={img}
					alt=""
				/>
				<span>{name}</span>
			</div>
			<div className="d-flex align-items-center gap-8">
				<span className="gray-color">online</span>
				<span className="online"></span>
			</div>
		</div>
	);
};
