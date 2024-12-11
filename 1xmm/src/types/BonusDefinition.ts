import { BonusTypes, BonusTerms } from "@/enums";

export type BonusDefinition = {
    id: number,
    bonus_type: BonusTypes,
    benefit: number,
    duration: BonusTerms,
    cost: number
};