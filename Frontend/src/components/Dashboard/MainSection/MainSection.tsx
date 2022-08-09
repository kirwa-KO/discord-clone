import HeaderSection from "./HeaderSection";
import MessagesSection from "./MessagesSection";
import MessageInput from "./MessageInput";

const MainSection: React.FC = () => {
	return (
		<div className="d-flex flex-column h-100vh">
			<HeaderSection />
			<MessagesSection />
			<MessageInput />
		</div>
	);
}

export default MainSection