import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { singInUpApi } from "../services/auth";

const Login: React.FC = () => {
	const [userInfo, setUserInfo] = useLocalStorage("user");

	const navigate = useNavigate();

	if (userInfo && typeof userInfo !== "undefined" && userInfo.username) {
		navigate("/");
	}

	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [isForLogin, setIsForLogin] = useState(true);

	const onSubmitLoginRegister = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const username = usernameRef.current!.value;
		const password = passwordRef.current!.value;

		singInUpApi(username, password, isForLogin)
			.then((data) => {
				if (isForLogin === false) setIsForLogin(true);
				else {
					setUserInfo(data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const switchSingInUpHandler = (e: any) => {
		e.preventDefault();
		setIsForLogin(!isForLogin);
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
					{isForLogin ? "Welcome back!" : "Create an account"}
				</h4>
				<p className="gray-color text-center text-12-px">
					{isForLogin
						? "We're so excited to see you again!"
						: "We're exticed to see you joining us"}
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
					{isForLogin ? "Login" : "Register"}
				</button>
				<p className="mt-3 m-0 gray-color text-12-px">
					{isForLogin ? (
						<>
							Need an account?{" "}
							<a
								href="/#"
								className="blue-color"
								onClick={switchSingInUpHandler}
							>
								Register
							</a>
						</>
					) : (
						<a
							href="/#"
							className="blue-color"
							onClick={switchSingInUpHandler}
						>
							Already have an account?
						</a>
					)}
				</p>
			</form>
		</div>
	);
};

export default Login;
