import axios from "axios";

export const getAllRomsAndUsersApi = (): Promise<any> => {
	return axios.get("/room/user/all").then(res => res.data);
};

export const getRoomData = (roomName: string): Promise<any> => {
	return axios.get(`/room/${roomName}`).then(res => res.data);
}