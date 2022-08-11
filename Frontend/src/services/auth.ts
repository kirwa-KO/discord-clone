import axios from "axios";

export const singInUpApi = (
	username: string,
	password: string,
	isForLogin: boolean
): Promise<any> => {
	let linkToSend = "/auth/" + (isForLogin ? "login" : "register");

	return axios.post(linkToSend, { username, password, }).then(res => res.data);
};
