import axios from "axios";

export const getAllRomsApi = (): Promise<any> => {
	// console.log("getAllRomsApi");
	// console.log(axios.defaults.baseURL);
	// const instance = axios.create();
	return axios.get("/room/all").then(res => res.data);
};
