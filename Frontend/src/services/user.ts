import axios from "axios";

export const getAllUsers = (): Promise<any> => {
	return axios.get("/user/all").then(res => res.data);
};
