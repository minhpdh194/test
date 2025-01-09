import { BonusTypes, Leverages, LongShort } from "@/enums";
import { toast } from "react-toastify";
import { UserProfile } from "../types/UserProfile";
import { Bonus } from "./Bonus";
import { COMM } from "@/lib/comm";
import { $http } from "@/lib/http";
import { Pair } from "@/types/Pair";

const penaltyFee: number = 0.001;

export type PositionChange = {
    amount_adjustment: number;
    realized_pnl: number;
}

export type PnLResult = {
    is_zero: boolean;
    pnl: number;
    perf: number;
}

export class Position {
    last_update_timestamp: number;
    telegram_user_id: number;
    position_id: number;
    pair: Pair;
    long_short: LongShort;
    amount: number;
    index_at_start: number;
    leverage: number;
    bonuses: Bonus[] = [];
    open_date: number;
    min_end_date: number;
    performance: number;

    // This opens a new position
    public constructor(pair: Pair, ls: LongShort, amt: number, index_at_start: number, lev: number, min_end_date: number) {
        this.telegram_user_id = globalThis.userProfile.telegram_user_id;
        this.position_id = pair.id;
        this.pair = pair;
        this.long_short = ls;
        this.amount = amt;
        this.index_at_start = index_at_start;
        this.leverage = lev;
        this.min_end_date = min_end_date;
        this.open_date = min_end_date - 21600;
        
        // We initialize the last_update_timestamp to 0 to indicate that the position has not been updated yet
        // When loading the positions, the update is required => the last_update_timestamp will be set to the current timestamp
        this.last_update_timestamp = this.open_date;
        this.performance = 0.0;
    }

    public set_last_update_timestamp(timestamp: number) {
        this.last_update_timestamp = timestamp;
    }

    public attach_new_bonus(bonus: Bonus): void {
        if (!this.bonuses.some(b => b.id === bonus.id)) {
        bonus.attach_to_position(this, this.last_update_timestamp + bonus.bonus_definition.duration);
        this.bonuses.push(bonus);
    }
    }

    public attach_existing_bonus(bonus: Bonus): boolean {
        if (bonus.end_date && bonus.bonus_is_valid(new Date().getTime() / 1000)) {
            this.bonuses.push(bonus);
            return true;
        }

        return false;
    }

    public remove_bonus(id: number) {
        this.bonuses = this.bonuses.filter(b => b.id != id);
    }

    public remove_expired_bonuses() {
        const now = new Date().getTime() * 0.001;
        for (let i = this.bonuses.length - 1; i >= 0; i--)
            if (this.bonuses[i].end_date! < now) this.bonuses.pop();
    }

    public get_bonus_end_date(bonus: Bonus): {is_attached: boolean, end_date: number | null} {
        const b = this.bonuses.find(b => b.id == bonus.id);

        if (!b) return { is_attached: false, end_date: null };
        return { is_attached: true, end_date: b.end_date };
    }
    
    public update(value_date: number, index_value: number): PnLResult {
        this.last_update_timestamp = value_date;
        const pnlUpdate = this.computePnL(value_date, index_value);
        this.performance = pnlUpdate.perf;
        return pnlUpdate;
    }

    public add(ls: LongShort, amt: number, lev: Leverages, bonuses: Bonus[]): PositionChange {
        if (ls === this.long_short) {
            const index_value = COMM.getIndex(this.pair.id, this.long_short);
            const lev_amt = this.amount * this.leverage;
            const new_lev_amt = amt * (lev as number);

            if (!index_value) return {
                amount_adjustment: 0,
                realized_pnl: 0
            };

            const pnl = this.computePnL(index_value.timestamp, index_value.value);

            this.index_at_start = index_value.value;
            this.last_update_timestamp = index_value.timestamp;
            this.performance = 0;
            this.amount += amt;
            this.leverage = (lev_amt + new_lev_amt) / this.amount;

            bonuses.forEach(b => this.attach_new_bonus(b));

            // No PnL has been generated
            return {
                amount_adjustment: -amt,
                realized_pnl: pnl.pnl
            };
        } else {
            let penalty = 0.0;
            let pnl = 0.0;
            const index_value = COMM.getIndex(this.pair.id, this.long_short);

            if (index_value == undefined) {
                toast.error("Issues with position's timestamps");
                return {
                    amount_adjustment: 0,
                    realized_pnl: 0
                }
            }

            const value_date = index_value.timestamp;

            if (this.min_end_date > value_date) penalty = penaltyFee;

            const bonus_factors = this.get_performance_adjustment_factors(globalThis.userProfile);
            const pro_rata = Math.min(1.0, (value_date - this.open_date + bonus_factors.total_time_reduction) / (this.min_end_date - this.open_date));

            const net_perf = (index_value!.value - this.index_at_start) - (1 - pro_rata) * penalty;

            if (amt <= this.amount) {
                // Partial position closepositive_leverage
                if (net_perf > 0) {
                    pnl = pro_rata * (bonus_factors.total_leverage + bonus_factors.total_positive_leverage) * pro_rata * net_perf * amt;
                } else {
                    pnl = bonus_factors.total_leverage * net_perf * amt * (1 - bonus_factors.total_capital_protection);
                }
                this.amount -= amt;
                bonuses.forEach(b => this.attach_new_bonus(b));

                return {
                    amount_adjustment: amt,
                    realized_pnl: pnl
                }
            } else {
                // Full position close and reverse
                if (net_perf > 0) {
                    pnl = pro_rata * (bonus_factors.total_leverage + bonus_factors.total_positive_leverage) * net_perf * this.amount;
                } else {
                    pnl = bonus_factors.total_leverage * net_perf * this.amount * (1 - bonus_factors.total_capital_protection);
                }

                // It is a new position, not an increase in position
                this.performance = 0;
                const prev_amt = this.amount;
                this.amount = amt - prev_amt;
                this.index_at_start = index_value!.value;
                this.long_short = this.long_short == LongShort.Long
                    ? LongShort.Short
                    : LongShort.Long;
                this.leverage = lev;
                this.open_date = value_date;
                // We also update the min_end_date since it is a new position
                this.min_end_date = value_date + 21600;

                bonuses.forEach(b => this.attach_new_bonus(b));
                toast.success("Position updated successfully");

                return {
                    amount_adjustment: prev_amt - this.amount,
                    realized_pnl: pnl
                }
            }
        }
    }

    public get_PnL(): PnLResult {
        const index_value = COMM.getIndex(this.pair.id, this.long_short);

        if (index_value == undefined) {
            toast.error("Issues with position's timestamps");

            return {
                is_zero: false,
                pnl: 0,
                perf: this.performance
            }
        }
        
        return this.computePnL(index_value!.timestamp, index_value!.value);
    }

    public get_performance_adjustment_factors(userProfile: UserProfile): AdjustmentFactors {
        let total_leverage = this.leverage;
        let total_positive_leverage = userProfile.trading_info.positive_leverage;
        let total_capital_protection = userProfile.trading_info.capital_protection;
        let total_time_reduction = userProfile.trading_info.time_reduction;

        const bonusToDelete = this.check_bonuses();
        if (bonusToDelete.length > 0) { COMM.bonusExpiry($http, bonusToDelete); }

        this.bonuses.forEach(b => {
            switch (b.bonus_definition.bonus_type) {
                case BonusTypes.Leverage:
                    total_leverage += b.bonus_definition.benefit;
                    break;
                case BonusTypes.PositiveLeverage:
                    total_positive_leverage += b.bonus_definition.benefit;
                    break;
                case BonusTypes.CapitalProtection:
                    total_capital_protection += b.bonus_definition.benefit;
                    break;
                case BonusTypes.TimeReduction:
                    total_time_reduction = Math.min(359, total_time_reduction + b.bonus_definition.benefit);
                    break;
                default:
                    console.error("Unknown bonus type:", b.bonus_definition.bonus_type);
                    throw new Error("Unknown bonus type");
            }
        });

        return {
            total_leverage: total_leverage,
            total_positive_leverage: total_positive_leverage,
            total_capital_protection: total_capital_protection,
            total_time_reduction: total_time_reduction
        };
    }

    public check_bonuses(): number[] {
        const remainingBonuses: Bonus[] = [];
        const bonusToDelete: number[] = [];

        this.bonuses.forEach(b => {
            if (b.bonus_is_valid(this.last_update_timestamp)) {
                remainingBonuses.push(b);
            } else {
                bonusToDelete.push(b.id);
            }
        });

        this.bonuses = remainingBonuses;
        return bonusToDelete;
    }

    private computePnL(value_date: number, index_value: number): PnLResult {
        let penalty = 0.0;
        let total_pnl = 0.0;
        let isZero = false;
        this.last_update_timestamp = value_date;

        const adj_factors = this.get_performance_adjustment_factors(globalThis.userProfile);
        if (this.min_end_date > this.last_update_timestamp) penalty = penaltyFee;

        const pro_rata = Math.min(1.0, (this.last_update_timestamp - this.open_date + adj_factors.total_time_reduction) / (this.min_end_date - this.open_date));
        const net_perf = (index_value! - this.index_at_start) - (1 - pro_rata) * penalty;

        if (net_perf > 0) {
            total_pnl = pro_rata * (adj_factors.total_leverage + adj_factors.total_positive_leverage) * net_perf * this.amount;
        } else {
            let negPerf: number = adj_factors.total_leverage * net_perf * (1 - adj_factors.total_capital_protection);
            if (negPerf <= -1) { negPerf = -1; isZero = true; }
            total_pnl = negPerf * this.amount;
        }

        this.performance = total_pnl / this.amount;

        return {
            is_zero: isZero,
            pnl: total_pnl,
            perf: this.performance
        }
    }
}

type AdjustmentFactors = {
    total_leverage: number;
    total_positive_leverage: number;
    total_capital_protection: number;
    total_time_reduction: number;
}