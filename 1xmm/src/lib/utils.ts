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
	}); 
}

// Utils module
export const Utils = {
	// Timestamps are in seconds
	getLastFixingTimestamp: async (): Promise<number> => get_lastfixing_timestamp(),
	getNextFixingTimestamp: async (): Promise<number> => get_nextfixing_timestamp(),
	// positionWasZero: (exist_position: Position): boolean =>
	// check_position(exist_position),
	formatString: (input: string) => format_string(input),
	toCamelFormat: (input: string) => { return input.charAt(0).toUpperCase() + input.slice(1); },
	formatDate: (input: string) => format_date(input),
	getAvatarRef: (input: string) => get_avatar_ref(input),
};

const get_avatar_ref = (input: string): number => {
	const startIndex = input.indexOf('__') + 2;
	input = input.substring(startIndex);
	return Number(input.substring(0, input.indexOf('__')));
}

/*********************************
 * Functions requiring RPC Calls *
 *********************************/
// To avoid wrong user timestamp, we sync all timestamps with the server
const get_timestamp_from_server = async (): Promise<number> => {
	return (await $http.get('/timestamp')).data.timestamp;
}

const get_lastfixing_timestamp = async (): Promise<number> => {
	let d = Math.floor(await get_timestamp_from_server() / 120);
	return d * 120;
}

const get_nextfixing_timestamp = async (): Promise<number> => {
	let d = Math.floor(await get_timestamp_from_server() / 120);
	return (d + 1) * 120;
}

const format_string = (input: string) => {
	return input.replace(/([A-Z])/g, ' $1').trim();
}

const format_date = (input: string) => {
	const date = new Date(input);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	const formattedDate = `${day}-${month}-${year}`;
	return formattedDate;
}