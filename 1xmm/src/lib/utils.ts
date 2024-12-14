import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pair } from "@/types/Pair";
import { Leverages, LongShort } from "../enums";
import { $http } from "@/lib/http";
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
	getIndexPerf: (pair: Pair, long_short: LongShort, open_date: number, value_date: number): number => get_index_perf(pair, long_short, open_date, value_date),
	// Timestamps are in seconds
	getLastFixingTimestamp: (): number => get_lastfixing_timestamp(),
	getNextFixingTimestamp: (): number => get_nextfixing_timestamp(),
	getPositionTimestamp: (): number => get_position_timestamp(),
	positionWasZero: async (pair: Pair, long_short: LongShort, _open_date: number, _leverage: Leverages): Promise<boolean> =>
		check_position(pair, long_short, _open_date, _leverage),
	formatString: (input: string) => format_string(input),
	toCamelFormat: (input: string) => { return input.charAt(0).toUpperCase() + input.slice(1); }
};

/*********************************
 * Functions requiring RPC Calls *
 *********************************/

const hasLeverageBonuses = (bonuses: any): any[] => {	
	let leverageBonuses: any[] = [];

	if (Array.isArray(bonuses)) {
		leverageBonuses = bonuses.filter(bonus =>
			bonus.end_date > Utils.getPositionTimestamp() &&
			bonus.bonus_type.bonus_type === "Leverage"
		);
	} else if (bonuses.bonus_type && bonuses.bonus_type.bonus_type === "Leverage") {
		leverageBonuses.push(bonuses);
	}

	return leverageBonuses;
}

const hasPositiveLeverageBonuses = (bonuses: any): any[] => {
	let leverageBonuses: any[] = [];

	if (Array.isArray(bonuses)) {
		leverageBonuses = bonuses.filter(bonus =>
			bonus.end_date > Utils.getPositionTimestamp() &&
			bonus.bonus_type.bonus_type === "PositiveLeverage"
		);
	} else if (bonuses.bonus_type && bonuses.bonus_type.bonus_type === "PositiveLeverage") {
		leverageBonuses.push(bonuses);
	}

	return leverageBonuses;
}

const hasCapitalLeverageBonuses = (bonuses: any): any[] => {
	let leverageBonuses: any[] = [];

	if (Array.isArray(bonuses)) {
		leverageBonuses = bonuses.filter(bonus =>
			bonus.end_date > Utils.getPositionTimestamp() &&
			bonus.bonus_type.bonus_type === "CapitalProtection"
		);
	} else if (bonuses.bonus_type && bonuses.bonus_type.bonus_type === "CapitalProtection") {
		leverageBonuses.push(bonuses);
	}

	return leverageBonuses;
}

const get_index_perf = (_pair: Pair, _long_short: LongShort, _open_date: number, _value_date: number): number => {
	return 0;
}

const long_position_ratio = (totalLongAmount: { [key: string]: any }, totalShortAmount: { [key: string]: any }): number => {
	const shortValue = totalShortAmount[0]?.short_value || 0;
	const longValue = totalLongAmount[0]?.long_value || 0;

	if (!longValue || !shortValue) return 0;
	return shortValue / longValue;
}

const short_position_ratio = (totalLongAmount: { [key: string]: any }, totalShortAmount: { [key: string]: any }): number => {

	const shortValue = totalShortAmount[0]?.short_value || 0;
	const longValue = totalLongAmount[0]?.long_value || 0;

	if (!longValue || !shortValue) return 0;
	return longValue / shortValue;
}

const check_position = async (_pair: Pair, _long_short: LongShort, _open_date: number, _lev: Leverages): Promise<boolean> => {
	try {
		return await $http.post('/check_zero', {
			pair_id: _pair.id,
			long_short: _long_short,
			open_date: _open_date,
			lev: _lev,
			value_date: Utils.getLastFixingTimestamp()
		});
	} catch (error) {
		throw new Error('Communication error - cannot validate transaction');
	}
}


const get_lastfixing_timestamp = (): number => {
	let d = Math.floor(Date.now() / 120000);
	return d * 120;
}

const get_position_timestamp = (): number => {
	let now = Math.floor(Date.now() / 1000);
	let d = Math.floor(now / 120);

	let mid = d * 120 + 60;
	return now > mid ? (d + 1) * 120 : d * 120;
}

const get_nextfixing_timestamp = (): number => {
	let d = Math.floor(Date.now() / 120000);

	return (d + 1) * 120;
}

const format_string = (input: string) => {
	return input.replace(/([A-Z])/g, ' $1').trim();
}
