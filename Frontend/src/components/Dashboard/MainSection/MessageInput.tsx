const MessageInput: React.FC = () => {

	const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submit");
	}

	return (
		<form className="form-group mx-4" onSubmit={onSubmitForm}>
			<input
				type="text"
				className="form-control main-input"
				id="exampleFormControlInput1"
				placeholder="Message @s7v7n"
			/>
		</form>
	);
};

export default MessageInput;
