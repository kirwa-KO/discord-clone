import "./styles/global.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import MyRoutes from "./routes/MyRoutes";
import axios from "axios";
import { getLocalItem } from "./hooks/useLocalStorage";

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
	return <MyRoutes />;
};

export default App;
