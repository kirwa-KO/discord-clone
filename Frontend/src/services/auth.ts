import axios from "axios";

// create an axios instance
const axiosInstance = axios.create({
	  baseURL: process.env.REACT_APP_API_URL,
});

export const loginApi = (
	username: string,
	password: string
): Promise<any> => {
	return axiosInstance
		.post("/auth/login", { username, password })
		.then((res) => res.data)
};


export const registerApi = (
	username: string,
	password: string
): Promise<any> => {

	return axiosInstance
		.post("/auth/register", { username, password })
		.then((res) => res.data)
};
