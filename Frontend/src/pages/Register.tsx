import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../services/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register: React.FC = () => {
	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();

	const onSubmitLoginRegister = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const username = usernameRef.current!.value;
		const password = passwordRef.current!.value;
		registerApi(username, password)
			.then((data) => {
				console.log(data);
				toast.success("You Account created success !!", {
					position: toast.POSITION.TOP_CENTER,
				});
				toast.info("Please login now !!", {
					position: toast.POSITION.TOP_CENTER,
				});
				navigate("/login");
			})
			.catch((err) => {
				console.error(err.response);
				toast.error(err.response.data.message[0], {
					position: toast.POSITION.TOP_CENTER,
					pauseOnFocusLoss: false
				});
			});
	};

	return (
		<div
			className="discord-img-bg w-100 d-flex align-items-center justify-content-center"
			style={{
				height: "100vh",
			}}
		>
			<form
				className="w-30 main-bg p-4 rounded"
				onSubmit={onSubmitLoginRegister}
			>
				<h4 className="text-center font-weight-bold">
					Create an account
				</h4>
				<p className="gray-color text-center text-12-px">
					We're exticed to see you joining us
				</p>
				<div className="form-group">
					<label
						htmlFor="id-input"
						className="text-12-px gray-color font-weight-bold text-uppercase"
					>
						Username
					</label>
					<input
						type="text"
						className="form-control dark-input"
						id="username-input"
						placeholder=""
						ref={usernameRef}
					/>
				</div>
				<div className="form-group">
					<label
						htmlFor="id-input"
						className="text-12-px gray-color font-weight-bold text-uppercase"
					>
						Password
					</label>
					<input
						type="password"
						className="form-control dark-input"
						id="password-input"
						placeholder=""
						ref={passwordRef}
					/>
				</div>
				<button className="btn main-btn w-100 mt-2">
					Create account
				</button>
				<p className="mt-3 m-0 gray-color text-12-px">
					<Link to="/login" className="blue-color">
						Already have an account?
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Register;
