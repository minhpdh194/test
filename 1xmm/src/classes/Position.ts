import { BonusTypes, Leverages, LongShort } from "@/enums";
import { Utils } from "../lib/utils";
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

export class Position {
    user_id: number;
    position_id: number;
    pair: Pair;
    long_short: LongShort;
    amount: number;
    leverage: number;
    bonuses: Bonus[] = [];
    open_date: number;
    min_end_date: number;
    performance: number;

    // This opens a new position
    public constructor(position_id: number, pair: Pair, ls: LongShort, amt: number, lev: number, min_end_date: number, bonuses: Bonus[], telegram_user_id: number) {
        this.user_id = telegram_user_id;
        this.position_id = position_id;
        this.pair = pair;
        this.long_short = ls;
        this.amount = amt;
        this.leverage = lev;
        this.bonuses = bonuses;
        this.open_date = min_end_date - 21600;
        this.min_end_date = min_end_date;
        this.performance = 0.0;
    }

    public attach_bonus(bonus: Bonus): boolean {
        bonus.attach_to_position(this);

        if (bonus.bonus_is_valid()) {
            this.bonuses.push(bonus);
            return true;
        }

        return false;
        }

    public async update() {
        // We should check if the option has 0 perf
    }

    public async add(ls: LongShort, amt: number, lev: Leverages, bonuses: Bonus[]) {
        if (ls === this.long_short) {
            const lev_amt = this.amount * this.leverage;
            const new_lev_amt = amt * (lev as number);
            this.performance = this.performance * lev_amt / (lev_amt + new_lev_amt);
            this.amount += amt;
            this.leverage = (lev_amt + new_lev_amt) / this.amount;

            bonuses.forEach(b => this.attach_bonus(b));
            toast.success("Position updated successfully");

            // No PnL has been generated
            return {
                amount_adjustment: -amt,
                realized_pnl: 0
            };
        } else {
            let penalty = 0.0;
            let pnl = 0.0;
            const value_date = Utils.getPositionTimestamp();

            if (this.min_end_date > Utils.getLastFixingTimestamp()) penalty = penaltyFee;

            const bonus_factors = this.get_performance_adjustment_factors(globalThis.userProfile);
            const pro_rata = Math.min(1.0, (value_date - this.open_date + bonus_factors.total_time_reduction) / (this.min_end_date - this.open_date));

            const index_perf = pro_rata * Utils.getIndexPerf(this.pair, this.long_short, this.open_date, value_date) - (1 - pro_rata) * penalty;

            if (amt <= this.amount) {
                // Partial position closepositive_leverage
                if (index_perf > 0) {
                    pnl = (bonus_factors.total_leverage + bonus_factors.total_positive_leverage) * index_perf * amt;
                } else {
                    pnl = bonus_factors.total_leverage * index_perf * amt * (1 - bonus_factors.total_capital_protection);
                }
                this.amount += amt;
                bonuses.forEach(b => this.attach_bonus(b));
                toast.success("Position updated successfully");

                return {
                    amount_adjustment: amt,
                    realized_pnl: pnl
                }
            } else {
                // Full position close and reverse
                if (index_perf > 0) {
                    pnl = (bonus_factors.total_leverage + bonus_factors.total_positive_leverage) * index_perf * this.amount;
                } else {
                    pnl = bonus_factors.total_leverage * index_perf * this.amount * (1 - bonus_factors.total_capital_protection);
                }

                this.performance = 0;
                const prev_amt = this.amount;
                this.amount = amt - prev_amt;
                this.long_short = this.long_short == LongShort.Long
                    ? LongShort.Short
                    : LongShort.Long;
                this.leverage = lev;
                this.open_date = value_date;
                // It is a new position, not an increase in position
                // We update the min_end_date
                this.min_end_date = value_date + 21600;

                bonuses.forEach(b => this.attach_bonus(b));
                toast.success("Position updated successfully");

                return {
                    amount_adjustment: prev_amt,
                    realized_pnl: pnl
                }
            }
        }
    }

    //public add(_pair: Pair, ls: LongShort, amt: number, lev: Leverages, bonuses: Bonus[]) {
    //    const pnl = -this.amount;
    //    this.long_short = ls;
    //    this.open_date = Utils.getPositionTimestamp();
    //    this.amount = amt;
    //    this.leverage = lev;
    //    this.performance = 0.0;

    //    // We attach new bonuses
    //    bonuses.forEach(b => this.attach_bonus(b));
    //    toast.success("Position added successfully");

    //    return {
    //        amount_adjustment: -amt,
    //        realized_pnl: pnl
    //    };
    //}

    public get_PnL(offset_date: number): number {

        let penalty = 0.0;
        let total_pnl = 0.0;

        const adj_factors = this.get_performance_adjustment_factors(globalThis.userProfile);
        if (this.min_end_date > offset_date) penalty = penaltyFee;

        const pro_rata = Math.min(1.0, (offset_date - this.open_date + adj_factors.total_time_reduction) / (this.min_end_date - this.open_date));

        const index_perf = pro_rata * Utils.getIndexPerf(this.pair, this.long_short, this.open_date, offset_date) - (1 - pro_rata) * penalty;

        if (index_perf > 0) {
            total_pnl = (adj_factors.total_leverage + adj_factors.total_positive_leverage) * index_perf * this.amount;
        } else {
            total_pnl = (adj_factors.total_leverage) * index_perf * this.amount * (1 - adj_factors.total_capital_protection);
        }

        return total_pnl;
    }

    public get_Return(offset_date: number): number {
        return this.get_PnL(offset_date) / this.amount;
    }

    public get_performance_adjustment_factors(userProfile: UserProfile): AdjustmentFactors {
        let total_leverage = this.leverage;
        let total_positive_leverage = userProfile.trading_info.positive_leverage;
        let total_capital_protection = userProfile.trading_info.capital_protection;
        let total_time_reduction = userProfile.trading_info.time_reduction;

        const bonusToDelete = this.check_bonuses();
        if (bonusToDelete.length > 0) { COMM.bonusExpiry($http, this.user_id, bonusToDelete); }

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
            if (b.bonus_is_valid()) {
                remainingBonuses.push(b);
            } else {
                bonusToDelete.push(b.id);
            }
        });

        this.bonuses = remainingBonuses;
        return bonusToDelete;
    }
}

type AdjustmentFactors = {
    total_leverage: number;
    total_positive_leverage: number;
    total_capital_protection: number;
    total_time_reduction: number;
}