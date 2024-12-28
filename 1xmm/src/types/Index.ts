import { LongShort } from "@/enums";

export type Index = {
    pair_id: number,
    long_short: LongShort,
    value: number;
}