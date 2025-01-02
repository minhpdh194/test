import { LongShort } from "@/enums"

export type UserPosition = {
    id: number,
    pair_id: number,
    long_short: LongShort,
    index_start: number;
    amount: number,
    average_leverage: number,
    bonuses_id: string,
    min_end_date: number
}