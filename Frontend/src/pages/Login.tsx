import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { loginApi } from "../services/auth";
import { toast } from "react-toastify";

const Login: React.FC = () => {
	const [userInfo, setUserInfo] = useLocalStorage("user");

	const navigate = useNavigate();
	if (userInfo && typeof userInfo !== "undefined" && userInfo.username) {
		navigate("/");
	}

	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const onSubmitLoginRegister = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const username = usernameRef.current!.value;
		const password = passwordRef.current!.value;

		loginApi(username, password)
			.then((data) => {
				setUserInfo(data);
				console.log(data);
				toast.success("You login success !!", {
					position: toast.POSITION.TOP_CENTER,
				});
				// navigate("/");
			})
			.catch((err) => {
				console.error(err.response);
				toast.error(err.response.data.message, {
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
					Welcome back!
				</h4>
				<p className="gray-color text-center text-12-px">
					"We're so excited to see you again!"
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
				<button className="btn main-btn w-100 mt-2">Login</button>
				<p className="mt-3 m-0 gray-color text-12-px">
					Need an account?{" "}
					<Link
						to="/register"
						className="blue-color"
					>
						Register
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Login;
