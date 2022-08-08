
const getRoomName = (username1: string, username2: string): string => {
	let roomName: string;
	if (username1 < username2) {
		roomName = `${username1}|${username2}`;
	}
	else {
		roomName = `${username2}|${username1}`;
	}
	return roomName;
}

export default getRoomName;