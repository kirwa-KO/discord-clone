import React, { Suspense } from "react";
import {
	BrowserRouter as Router,
	Navigate,
	Outlet,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import { AuthUserType } from "../types/types";
import useLocalStorage from "../hooks/useLocalStorage";

const MyRoutes: React.FC = () => {

	return (
		<Suspense
			fallback={
				<div style={{ textAlign: "center", marginTop: "1rem" }}>
					Loading...
				</div>
			}
		>
			<Router>
				<Routes>
					<Route element={<NotRequireAuth />}>
						<Route path="/login" element={<Login />} />
					</Route>

					<Route element={<RequireAuth />}>
						<Route path="/" element={<Dashboard />} />
					</Route>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Router>
		</Suspense>
	);
};

export default MyRoutes;

function RequireAuth({ children }: { children?: JSX.Element }) {
	const userData: AuthUserType = useLocalStorage("user")[0];

	let location = useLocation();

	if (isUserLoggedIn(userData) === false) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	if (children) {
		return children;
	}
	return <Outlet />;
}

function NotRequireAuth({ children }: { children?: JSX.Element }) {
	const userData: AuthUserType = useLocalStorage("user")[0];

	let location = useLocation();

	if (isUserLoggedIn(userData) === true) {
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	if (children) {
		return children;
	}
	return <Outlet />;
}

const isUserLoggedIn = (userData: AuthUserType): boolean => {
	if (
		userData &&
		userData.access_token != null &&
		userData.access_token.length > 0 &&
		userData.username != null &&
		userData.username.length > 0 &&
		userData.userId != null &&
		userData.userId.length > 0
	) {
		return true;
	}

	return false;
};
