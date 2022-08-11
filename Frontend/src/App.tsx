import "./styles/global.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import MyRoutes from "./routes/MyRoutes";
import { useEffect } from "react";
import axios from "axios";
import useLocalStorage, { getLocalItem } from "./hooks/useLocalStorage";

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
	const [userInfo, setUserInfo] = useLocalStorage("user");

	useEffect(() => {
		console.log("useEffect in app");
		if (userInfo) {
			axios.defaults.headers.common["Authorization"] = userInfo.token ? `Bearer ${userInfo.token}` : "";
		}
	}, [userInfo])

	return <MyRoutes />;
};

export default App;
