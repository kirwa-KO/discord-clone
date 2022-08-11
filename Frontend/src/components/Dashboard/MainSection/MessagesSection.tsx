import { MessageType } from "../../../types/types";
import moment from "moment";

// "Yesterday at 5:47 PM" */}

const MessagesSection: React.FC<{
	messages: MessageType[];
}> = ({ messages }) => {
	return (
		<div className="flex-grow-1 m-4 d-flex flex-column gap-12 overflow-y-scroll">
			{messages.map((message: MessageType) => (
				<MessageCard
					key={message._id}
					time={moment(message.updatedAt).format("MMM D, YYYY [at] HH:mm")}
					sender={message.sendBy.username}
					content={message.content}
				/>
			))}
		</div>
	);
};

export default MessagesSection;

const MessageCard: React.FC<{
	content: string;
	sender: string;
	time: string;
}> = ({ content, sender, time }) => {
	return (
		<div className="d-flex gap-12">
			<img
				width={40}
				height={40}
				className="rounded-circle"
				src={`${process.env.REACT_APP_AVATARS_URL}/api/avatar?name=${sender}`}
				alt=""
			/>
			<div>
				<div className="d-flex gap-8">
					<span className="font-weight-bold">{sender}</span>
					<span className="gray-color">{time}</span>
				</div>
				<div>{content}</div>
			</div>
		</div>
	);
};
