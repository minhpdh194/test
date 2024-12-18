import { LongShort } from "@/enums"

export type UserPosition = {
    id: number,
    pair_id: number,
    long_short: LongShort,
    amount: number,
    average_leverage: number,
    bonuses: number[],
    min_end_date: number
}