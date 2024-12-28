import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { $http } from "./http";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function compactNumber(num: number) {
	return num.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		notation: "compact",
	});1
}

// Utils module
export const Utils = {
	// Timestamps are in seconds
	getLastFixingTimestamp: async (): Promise<number> => get_lastfixing_timestamp(),
	getNextFixingTimestamp: async (): Promise<number> => get_nextfixing_timestamp(),
	getPositionTimestamp: async (): Promise<number> => get_position_timestamp(),
	// positionWasZero: (exist_position: Position): boolean =>
	// check_position(exist_position),
	formatString: (input: string) => format_string(input),
	toCamelFormat: (input: string) => { return input.charAt(0).toUpperCase() + input.slice(1); }
};

/*********************************
 * Functions requiring RPC Calls *
 *********************************/
// To avoid wrong user timestamp, we sync all timestamps with the server
const get_timestamp_from_server = async (): Promise<number> => {
	return (await $http.get('/timestamp')).data.timestamp;
}

const get_position_timestamp = async (): Promise<number> => {
	let now = Math.floor(await get_timestamp_from_server() / 1000);
	let d = Math.floor(now / 120);

	let mid = d * 120 + 60;
	return now > mid ? (d + 1) * 120 : d * 120;
}

const get_lastfixing_timestamp = async (): Promise<number> => {
	let d = Math.floor(await get_timestamp_from_server() / 120000);
	return d * 120;
}

const get_nextfixing_timestamp = async (): Promise<number> => {
	let d = Math.floor(await get_timestamp_from_server() / 120000);
	return (d + 1) * 120;
}

const format_string = (input: string) => {
	return input.replace(/([A-Z])/g, ' $1').trim();
}
