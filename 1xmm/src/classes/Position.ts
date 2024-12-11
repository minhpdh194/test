import { BonusTypes, Leverages, LongShort } from "@/enums";
import { Utils } from "../lib/utils";
import { SpotType, Volatility } from "../types/SpotType";
import { toast } from "react-toastify";
import { UserProfile } from "../types/UserProfile";
import { Bonus } from "./Bonus";
import { bonusDefinitions } from "@/referential/bonusDefinitions";
import { $http } from "@/lib/http";
import { usePositionStore } from '@/store/position-store';
import { Pair } from "@/types/Pair";

export class Position {
    userId: number;
    position_id: number;
    pair: Pair;
    long_short: LongShort;
    amount: number;
    leverage: number;
    bonuses: Bonus[] = [];
    open_date: number;
    min_end_date: number;
    performance: number;
    level_positive_leverage_bonus: number;
    level_capital_protection_bonus: number;
    time_reduction: number;

    public constructor(position_id: number, pair: Pair, ls: LongShort, amt: number, lev: number, min_end_date: number, bonuses: Bonus[], user_profile: UserProfile) {
        this.userId = user_profile.id;
        this.position_id = position_id;
        this.pair = pair;
        this.long_short = ls;
        this.amount = amt;
        this.leverage = lev;
        this.bonuses = bonuses;
        this.min_end_date = min_end_date;
        this.open_date = min_end_date - 21600;
        this.performance = 0.0;
        this.level_positive_leverage_bonus = user_profile.trading_info.positive_leverage || 0;
        this.level_capital_protection_bonus = user_profile.trading_info.capital_protection || 0;
        this.time_reduction = user_profile.trading_info.time_reduction || 0;
    }

    public async update()
    {
        return;
    }

    public async add(_pair: Pair, ls: LongShort, amt: number, lev: Leverages, bonuses: any): Promise<number> {
        const positions = usePositionStore.getState().positions;

        const existingPosition = positions.find(pos => pos.position_id === this.pair.id && pos.amount > 0);
        let open_date = Utils.getPositionTimestamp();

        if (Utils.positionWasZero(this.pair, this.long_short, this.open_date, lev, Utils.getLastFixingTimestamp(), existingPosition)) {
            let pnl = -this.amount;
            this.long_short = ls;
            this.bonuses = bonuses;
            this.open_date = open_date;
            this.amount = amt;
            this.leverage = lev;
            this.performance = 0.0;

            usePositionStore.getState().addPosition(this);
            toast.success("Position added successfully");
            return pnl;
        }

        if (existingPosition) {
            if (ls === existingPosition.long_short) {
                let lev_amt = existingPosition.amount * existingPosition.leverage;
                let new_lev_amt = amt * (lev as number);
                existingPosition.bonuses = bonuses;
                existingPosition.performance = existingPosition.performance * (lev_amt) / (lev_amt + new_lev_amt);
                existingPosition.leverage = (lev_amt + new_lev_amt) / (existingPosition.amount + amt);
                existingPosition.amount = Number(existingPosition.amount) + Number(amt);
                await usePositionStore.getState().updatePosition(existingPosition);
                toast.success("Position updated successfully");
                return 0;
            } else {
                let penalty = 0.0;
                let total_perf = 0.0;
                const value_date = Utils.getPositionTimestamp();

                const bonus_factors = existingPosition.get_performance_adjustment_factors();
                let premium = existingPosition.getOptionPremium(String(existingPosition.pair), Number(existingPosition.current_value), Number(existingPosition.volatility?.forward), Number(existingPosition.volatility?.volatility));
                if (existingPosition.min_end_date > Utils.getLastFixingTimestamp()) {
                    penalty = Utils.getPenaltyFee(existingPosition.pair, existingPosition.position_id, existingPosition.long_short, premium.premium);
                }

                let pro_rata = Math.min(1.0, (open_date - existingPosition.open_date + bonus_factors[3]) /
                    (existingPosition.min_end_date - existingPosition.open_date));

                const index_perf = pro_rata * Utils.getIndexPerf(existingPosition.pair, existingPosition.long_short, existingPosition.open_date, value_date, existingPosition, existingPosition.open_return, this.open_return, this.level_positive_leverage_bonus, this.level_capital_protection_bonus, premium.premium) - (1 - pro_rata) * penalty;
                if (amt <= existingPosition.amount) {
                    // Partial position closepositive_leverage
                    if (index_perf > 0) {
                        total_perf = (existingPosition.leverage + this.level_positive_leverage_bonus +
                            bonus_factors[0] + bonus_factors[1]) * index_perf * amt;
                    } else {
                        total_perf = (existingPosition.leverage + bonus_factors[0]) * index_perf * amt *
                            (1 - (this.level_capital_protection_bonus + bonus_factors[2]));
                    }
                    existingPosition.amount -= amt;
                } else {
                    // Full position close and reverse
                    if (index_perf > 0) {
                        total_perf = (existingPosition.leverage + this.level_positive_leverage_bonus +
                            bonus_factors[0] + bonus_factors[1]) * index_perf * existingPosition.amount;
                    } else {
                        total_perf = (existingPosition.leverage + bonus_factors[0]) * index_perf *
                            existingPosition.amount * (1 - (this.level_capital_protection_bonus + bonus_factors[2]));
                    }

                    existingPosition.performance = 0;
                    existingPosition.amount = amt - existingPosition.amount;
                    existingPosition.bonuses = bonuses;
                    existingPosition.long_short = existingPosition.long_short == LongShort.Long ?
                        LongShort.Short : LongShort.Long;
                    existingPosition.leverage = lev;
                    existingPosition.open_date = open_date;
                }

                await usePositionStore.getState().updatePosition(existingPosition);
                toast.success("Position updated successfully");
                return total_perf;
            }
        }


        return 0;
    }

    public async closePosition(): Promise<number> {
        const positions = usePositionStore.getState().positions;
        const existingPosition = positions.find(pos =>
            pos.position_id === this.position_id &&
            pos.userId === this.userId
        );

        if (existingPosition) {
            const result = await this.performClosePosition(existingPosition);
            return result;
        } else {
            toast.error("No position found to close");
            return 0;
        }
    }

    private async performClosePosition(existingPosition: any): Promise<number> {
        const currentTimestamp = Utils.getPositionTimestamp();

        const bonus_factors = this.get_performance_adjustment_factors();
        // const forward = Number(this.current_value) * Math.exp(Number(this.volatility?.volatility) * 0.0006849315);

        if (!this.volatility) {
            console.error("No volatility found for pair", this.pair);

        }

        const premium = this.getOptionPremium(String(this.pair), Number(this.current_value), Number(this.volatility?.forward), Number(this.volatility?.volatility));

        if (this.min_end_date > currentTimestamp) {

            const proRata = Math.min(1.0, (currentTimestamp - this.open_date + bonus_factors[3]) / (this.min_end_date - this.open_date));

            const unrealizedPerf = this.get_PnL(currentTimestamp, premium.premium, existingPosition);
            const realizedPerf = unrealizedPerf * proRata;

            this.performance = realizedPerf;

            this.amount_of_1vmm += realizedPerf;

            this.amount_of_1vmm = Math.max(0, this.amount_of_1vmm);
            await this.sendClosePosition();

            return realizedPerf;
        } else {
            const totalPerf = this.get_PnL(currentTimestamp, premium.premium, existingPosition);
            this.performance = totalPerf;

            this.amount_of_1vmm += totalPerf;

            this.amount_of_1vmm = Math.max(0, this.amount_of_1vmm);
            await this.sendClosePosition();

            return totalPerf;
        }
    }

    private async sendClosePosition() {
        try {
            const positionData = {
                position_id: this.id,
                pair: this.pair,
                long_short: this.long_short,
                amount: this.amount,
                average_leverage: this.leverage,
                open_date: this.open_date,
                min_end_date: this.min_end_date,
                performance: this.performance,
                // average_positive_leverage: this.positive_leverage,
                // average_capital_protection: this.capital_protection,
            };
            await $http.post('/clicker/close-position', positionData);
        } catch (error) {
            console.error('Error updating position:', error);
        }
    }

    public get_PnL(offset_date: number, premium: number, exist_poition: any): number {

        let penalty = 0.0;
        let total_perf = 0.0;

        console.log('exist_position ', exist_poition);
        const bonus_factors = this.get_performance_adjustment_factors();
        if (this.min_end_date > offset_date) penalty = Utils.getPenaltyFee(this.pair, this.position_id, this.long_short, premium);
        let pro_rata = Math.min(1.0, (offset_date - this.open_date + bonus_factors[3]) / (this.min_end_date - this.open_date));
        console.log('pro_rata', pro_rata);

        const index_perf = pro_rata * Utils.getIndexPerf(this.pair, this.long_short, this.open_date, offset_date, exist_poition, this.leverage, this.level_positive_leverage_bonus, this.level_capital_protection_bonus, this.time_reduction, premium) - (1 - pro_rata) * penalty;

        if (index_perf > 0) {
            total_perf = (this.leverage + this.level_positive_leverage_bonus + bonus_factors[0] + bonus_factors[1]) * index_perf * this.amount;
        } else {
            total_perf = (this.leverage + bonus_factors[0]) * index_perf * this.amount * (1 - (this.level_capital_protection_bonus + bonus_factors[2]));
        }

        return total_perf;
    }

    public get_performance_adjustment_factors(): [number, number, number, number] {
        let total_leverage = this.leverage;
        let total_positive_leverage = this.level_positive_leverage_bonus;
        let total_capital_protection = this.level_capital_protection_bonus;
        let total_time_reduction = this.time_reduction;

        this.check_bonuses();

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

        return [total_leverage, total_positive_leverage, total_capital_protection, total_time_reduction];
    }

    public check_bonuses(): boolean {
        let remainingBonuses: Bonus[] = [];
        let updated = false;

        this.bonuses.forEach(b => {
            const bonusInstance = new Bonus(b.bonus_definition);
            bonusInstance.position_id = b.position_id;
            bonusInstance.end_date = b.end_date;

            if (bonusInstance.bonus_is_valid()) {
                remainingBonuses.push(bonusInstance);
            } else {
                updated = true;
            }
        });

        this.bonuses = remainingBonuses;
        return updated;
    }

    public attach_bonus(bonus: Bonus) {
        this.bonuses.push(bonus);
        bonus.attach_to_position(this);
    }

    private err(spot: number, strike: number, put: number): number {
        return strike - (spot + put);
    }

    private put(spot: number, forward: number, strike: number, volatility: number): number {
        let vol_sqrtT = volatility * Math.sqrt(0.00273972602739726);
        let b = spot / forward;
        let d1 = Math.log(forward / strike) / vol_sqrtT + 0.5 * vol_sqrtT;
        let d2 = d1 - vol_sqrtT;
        return b * strike * this.cdf(-d2) - spot * this.cdf(-d1);
    }

    private erf(x: number): number {
        const t = 1 / (1 + 0.3275911 * Math.abs(x));
        const tau = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
        const sign = x >= 0 ? 1 : -1;
        return sign * (1 - tau * Math.exp(-x * x));
    }

    private cdf(x: number): number {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }


    public getOptionPremium(symbol: string, spot: number, forward: number, volatility: number) {
        let strikeMin = spot;
        let r = 1.25;

        while (this.err(spot, spot * r, this.put(spot, forward, spot * r, volatility)) < 0) {
            strikeMin = spot * r;
            r = r + 0.25;
        };

        console.log('strikeMin', strikeMin);
        let strikeMax = spot * r;
        let d = strikeMax - strikeMin;
        do {
            let mid = strikeMin + 0.5 * d;
            let e2 = this.err(spot, mid, this.put(spot, forward, mid, volatility));
            if (e2 < 0) {
                strikeMin = mid;
            } else {
                strikeMax = mid;
            }

            d = strikeMax - strikeMin;
        } while (d > 1e-5);
        let strike = strikeMin + 0.5 * d;

        return {
            symbol,
            spot,
            premium: this.put(spot, forward, strike, volatility),
            timestamp: Utils.getLastFixingTimestamp()
        };
    }
}