import "./styles/global.scss";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useLocalStorage from "./hooks/useLocalStorage";
import 'bootstrap/dist/css/bootstrap.min.css'


const App: React.FC = () => {
	const [id, setId] = useLocalStorage("id");

	// console.log(id);

	if (
		id === null ||
		typeof id === "undefined" ||
		id === "undefined" ||
		id === ""
	)
		return <Login onSubmitId={setId} />;

	return <Dashboard id={id} />;
};

export default App;
