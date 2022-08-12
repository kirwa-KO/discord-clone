import "bootstrap/dist/css/bootstrap.min.css";
import MyRoutes from "./routes/MyRoutes";
import axios from "axios";
import { getLocalItem } from "./hooks/useLocalStorage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/global.scss";

axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;

axios.interceptors.request.use(
	(config: any) => {
		if (!config.headers.Authorization) {
			const token = getLocalItem("user")!.access_token;

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}

		return config;
	},
	(error: any) => Promise.reject(error)
);

const App: React.FC = () => {
	return (
		<>
			<MyRoutes />
			<ToastContainer autoClose={2000} theme="colored" />
		</>
	);
};

export default App;
