



const MessagesSection: React.FC = () => {
	return (
		<div className="flex-grow-1 m-4 d-flex flex-column gap-12 overflow-y-scroll">
			<MessageCard time="Yesterday at 5:47 PM" sender="kirwa" content="Hello world" />
		</div>
	);
};

export default MessagesSection;

const MessageCard: React.FC<{
	content: string;
	sender: string;
	time: string;
}> = ({
	content,
	sender,
	time
}) => {
	return (
		<div className="d-flex gap-12">
			<img
				width={40}
				height={40}
				className="rounded-circle"
				src="http://localhost:8080/api/avatar?name=jdseed"
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
