import { useEffect, useState } from "react";

const PREFIX = "discord-clone";

export const getLocalItem = (key: string) => {
	const item = localStorage.getItem(`${PREFIX}-${key}`);
	return item ? JSON.parse(item) : null;
};

export const removeLocalItem = (key: string) => {
	localStorage.removeItem(`${PREFIX}-${key}`);
};

const useLocalStorage = (
	key: string,
	intialValue?: string | Function
): [value: any, setValue: (info: string) => void] => {
	const keyPrefix = `${PREFIX}-${key}`;

	const [value, setValue] = useState(() => {
		const jsonValue = localStorage.getItem(keyPrefix);
		if (
			jsonValue !== null &&
			typeof jsonValue !== "undefined" &&
			jsonValue !== "undefined"
		) {
			return JSON.parse(jsonValue);
		}
		if (typeof intialValue === "function") return intialValue();
		return intialValue;
	});

	useEffect(() => {
		localStorage.setItem(keyPrefix, JSON.stringify(value));
	}, [value, keyPrefix]);

	return [value, setValue];
};

export default useLocalStorage;
