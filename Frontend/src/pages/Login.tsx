import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const Login: React.FC<{
	onSubmitId: (id: string) => void;
}> = ({ onSubmitId }) => {

	const idRef = useRef<HTMLInputElement>(null);

	const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const inputId = idRef.current!.value;
		onSubmitId(inputId);
	}

	const createNewIdHandler = () => {
		const generatedId = uuidv4().substr(0, 5);
		onSubmitId(generatedId);
	}

	return (
		<div className="container d-flex align-items-center" style={{
			height: "100vh",
		}}>
			<form className="w-100" onSubmit={submitHandler}>
				<div className="form-group">
					<label htmlFor="id-input">
						Enter your id
					</label>
					<input
						type="text"
						className="form-control"
						id="id-input"
						placeholder=""
						ref={idRef}
					/>
				</div>
				<button className="btn btn-primary">Login</button>
				<button type="button" onClick={createNewIdHandler} className="btn btn-secondary ml-3">Create new id</button>
			</form>
		</div>
	);
};

export default Login;
