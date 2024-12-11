import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pair } from "@/types/Pair";
import { Leverages, LongShort } from "../enums";
import { usePositionStore } from '@/store/position-store';
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
	getIndexPerf: (pair: Pair, long_short: LongShort, open_date: number, value_date: number, exist_position: any, open_return: number, current_return: number, level_positive_leverage_bonus: number, level_capital_protection_bonus: number, premium: number): number => get_index_perf(pair, long_short, open_date, value_date, exist_position, open_return, current_return, level_positive_leverage_bonus, level_capital_protection_bonus, premium),
	// Timestamps are in seconds
	getLastFixingTimestamp: (): number => get_lastfixing_timestamp(),
	getNextFixingTimestamp: (): number => get_nextfixing_timestamp(),
	getPositionTimestamp: (): number => get_position_timestamp(),
	positionWasZero: (pair: Pair, long_short: LongShort, _open_date: number, _leverage: Leverages, value_date: number, exist_poition: any): boolean =>
		check_position(pair, long_short, _open_date, _leverage, value_date, exist_poition),
	getPenaltyFee: (pair: Pair, pair_id: number, long_short: LongShort, premium: number) => get_penalty_fee(pair, pair_id, long_short, premium),
	formatString: (input: string) => format_string(input),
};

/*********************************
 * Functions requiring RPC Calls *
 *********************************/
const getPositionStoreState = () => {
	const state = usePositionStore.getState();
	return state;
}

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

const get_penalty_fee = (_pair: Pair, pair_id: number, _long_short: LongShort, _premium: number): number => {	
	let prevLongValue = getPositionStoreState().prevTotalLongPositionAmount[pair_id] || 0;
	let prevShortValue = getPositionStoreState().prevTotalShortPositionAmount[pair_id] || 0;

	let n_t_i = _long_short === LongShort.Long 
		? prevShortValue / prevLongValue 
		: prevLongValue / prevShortValue;

	let unrealizedPerf = _premium * (1 / 720) * n_t_i;
	
	return unrealizedPerf;
}

const get_index_perf = (_pair: Pair, _long_short: LongShort, _open_date: number, _value_date: number, exist_position: any, open_return: number, current_return: number, level_positive_leverage_bonus: number, level_capital_protection_bonus: number, premium: number): number => {

	var spotPerf = current_return - open_return;
	let leverageBonus = 0;
	let positiveLeverageBonus = 0;
	let capitalProtectionBonus = 0;

	if (spotPerf == 0) return 0;

	if (exist_position.bonuses) {
		let lbonus = hasLeverageBonuses(exist_position.bonuses);
		if (lbonus) {
			for (let i = 0; i < lbonus.length; i++) {
				if (exist_position.bonuses[i].end_date > Utils.getPositionTimestamp()) {
					leverageBonus += exist_position.bonuses[i].bonus_type.benefit;
				} else {
					removeBonus(exist_position.id, i);
				}
			}
		}

		let plbonus = hasPositiveLeverageBonuses(exist_position.bonuses);

		if (exist_position.bonuses) {
			if (plbonus) {
				for (let i = 0; i < plbonus.length; i++) {
					if (exist_position.bonuses[i].end_date > Utils.getPositionTimestamp()) {
						positiveLeverageBonus += exist_position.bonuses[i].bonus_type.benefit;
					} else {
						removeBonus(exist_position.id, i);
					}
				}
			}
		}

		let cbonus = hasCapitalLeverageBonuses(exist_position.bonuses);

		if (exist_position.bonuses) {
			if (cbonus) {
				for (let i = 0; i < cbonus.length; i++) {
					if (exist_position.bonuses[i].end_date > Utils.getPositionTimestamp()) {
						capitalProtectionBonus += exist_position.bonuses[i].bonus_type.benefit;
					} else {
						removeBonus(exist_position.id, i);
					}
				}
			}
		}
	}

	let currentTotalLongPositionAmount = getPositionStoreState().currentTotalLongPositionAmount;
	let currentTotalShortPositionAmount = getPositionStoreState().currentTotalShortPositionAmount;

	if (spotPerf < 0) {
		if (exist_position.long_short === LongShort.Long) {

			return -(exist_position.leverage - leverageBonus) *
				exist_position.amount *
				(1 - capitalProtectionBonus - level_capital_protection_bonus / 100) *
				premium *
				0.000684931506849315;
		} else {
			return (exist_position.leverage + positiveLeverageBonus + leverageBonus) *
				exist_position.amount *
				(1 + level_positive_leverage_bonus / 100) *
				long_position_ratio(currentTotalLongPositionAmount, currentTotalShortPositionAmount) *
				premium *
				0.000684931506849315;
		}
	} else {
		if (exist_position.long_short === LongShort.Short) {
			return -(exist_position.leverage - leverageBonus) *
				exist_position.amount *
				(1 - capitalProtectionBonus - level_capital_protection_bonus / 100) *
				premium *
				0.000684931506849315;
		} else {
			return (exist_position.leverage + positiveLeverageBonus + leverageBonus) *
				exist_position.amount *
				(1 + level_positive_leverage_bonus / 100) *
				short_position_ratio(currentTotalLongPositionAmount, currentTotalShortPositionAmount) *
				premium *
				0.000684931506849315;
		}
	}
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

const removeBonus = async (position_id: number, bonus_index: number): Promise<void> => {
	try {
		await $http.delete(`/clicker/remove-bonus/${position_id}/${bonus_index}`);
	} catch (error) {
		console.error('Error removing bonus:', error);
	}
};

const check_position = (_pair: Pair, _long_short: LongShort, _open_date: number, _lev: Leverages ,_value_date: number, exist_position: any): boolean => {
	if (exist_position && _pair.pair_symbol === exist_position.pair && _value_date <= exist_position.open_date) {
		return false;
	} else {
		return true;
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
