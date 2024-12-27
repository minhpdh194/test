import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pair } from "@/types/Pair";
import { LongShort } from "../enums";
import { $http } from "./http";
import { COMM } from "./comm";

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
	getIndexPerf: (pair: Pair, long_short: LongShort, open_date: number, value_date: number): number => get_index_perf(pair, long_short, open_date, value_date),
	// Timestamps are in seconds
	getLastFixingTimestamp: (): number => get_lastfixing_timestamp(),
	getNextFixingTimestamp: (): number => get_nextfixing_timestamp(),
	getPositionTimestamp: (): number => get_position_timestamp(),
	// positionWasZero: (exist_position: Position): boolean =>
	// check_position(exist_position),
	formatString: (input: string) => format_string(input),
	toCamelFormat: (input: string) => { return input.charAt(0).toUpperCase() + input.slice(1); }
};

/*********************************
 * Functions requiring RPC Calls *
 *********************************/

const get_index_perf = (_pair: Pair, _long_short: LongShort, _open_date: number, _value_date: number): number => {
	let perf: number = 0;
	COMM.getIndexPerf($http, _pair.id, _long_short, _open_date, _value_date).then((res) => { perf = res; });
	return perf;
}

// To avoid wrong user timestamp, we sync all timestamps with the server
const get_timestamp_from_server = (): number => {
	let ts: number|null = null;

	$http.get('/api/timestamp').then((res) => {
		ts = Number(res.data.timestamp);
	});

	return !ts ? -1 : ts!;
}

const get_position_timestamp = (): number => {
	let now = Math.floor(get_timestamp_from_server() / 1000);
	let d = Math.floor(now / 120);

	let mid = d * 120 + 60;
	return now > mid ? (d + 1) * 120 : d * 120;
}

const get_lastfixing_timestamp = (): number => {
	let d = Math.floor(get_timestamp_from_server() / 120000);

	return d * 120;
}

const get_nextfixing_timestamp = (): number => {
	let d = Math.floor(get_timestamp_from_server() / 120000);

	return (d + 1) * 120;
}

const format_string = (input: string) => {
	return input.replace(/([A-Z])/g, ' $1').trim();
}
