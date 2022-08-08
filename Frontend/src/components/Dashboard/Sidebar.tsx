import { useState } from "react";

import { Tab, Nav, Button, Modal } from "react-bootstrap";

const CONVERSATIONS_KEY = "conversation";
const CONTACTS_KEY = "contact";

const Sidebar: React.FC = () => {
	const [activeKey, setActiveKey] = useState<any>(CONVERSATIONS_KEY)

	return (
		<div style={{ width: "250px" }} className="d-flex flex-column">
			<Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
				<Nav variant="tabs" className="justify-content-center">
					<Nav.Item>
						<Nav.Link eventKey={CONVERSATIONS_KEY}>
							Conversations
						</Nav.Link>
					</Nav.Item>
					<Nav.Item>
						<Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
					</Nav.Item>
				</Nav>

				{/* <Tab.Content className="border-right overflow-auto flex-grow-1">
					<Tab.Pane eventKey={CONVERSATIONS_KEY}>
						<Conversations />
					</Tab.Pane>
					<Tab.Pane eventKey={CONTACTS_KEY}>
						<Contacts />
					</Tab.Pane>
				</Tab.Content> */}
			</Tab.Container>
		</div>
	);
};

export default Sidebar;
