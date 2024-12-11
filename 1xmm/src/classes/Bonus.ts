import { Utils } from "@/lib/utils";
import { BonusDefinition } from "@/types/BonusDefinition";
import { Position } from "./Position";

export class Bonus {
    bonus_definition: BonusDefinition;
    position_id: number;
    end_date: number;

    public constructor(bonus_definition: BonusDefinition) {
        this.bonus_definition = bonus_definition;
        this.position_id = -1;
        this.end_date = -1;
    }

    public attach_to_position(p: Position) {
        this.position_id = p.position_id;
        this.end_date = p.min_end_date + (this.bonus_definition.duration as number) - 21600;
    }

    public bonus_is_valid(): boolean {
        return this.end_date >= Utils.getNextFixingTimestamp();
    }
}