import { ChatType } from "../../../types/types";
import { DM_LABEL } from "../../../utils/constans";


const HeaderSection: React.FC<{selectedUserDM: ChatType, choosenChat: ChatType}> = ({ choosenChat, selectedUserDM }) => {
	return (
		<div className="dark-2-bg py-3 px-3 font-weight-bold">
			<span className="gray-color">@</span>
			<span className="ml-2 text-capitalize">
				{ choosenChat.name === DM_LABEL && (selectedUserDM.name || choosenChat.name) }
				{ choosenChat.name !== DM_LABEL && choosenChat.name }
				</span>
		</div>
	);
};

export default HeaderSection;