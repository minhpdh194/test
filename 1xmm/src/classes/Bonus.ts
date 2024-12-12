import { Utils } from "@/lib/utils";
import { BonusDefinition } from "@/types/BonusDefinition";
import { Position } from "./Position";

export class Bonus {
    id: number;
    bonus_definition: BonusDefinition;
    position_id: number;
    end_date: number|null;

    public constructor(id: number, bonus_definition: BonusDefinition) {
        this.id = id;
        this.bonus_definition = bonus_definition;
        this.position_id = -1;
        this.end_date = null;
    }

    public attach_to_position(p: Position) {
        this.position_id = p.position_id;
        this.end_date = Utils.getNextFixingTimestamp();
    }

    public bonus_is_valid(): boolean {
        return this.end_date == null || this.end_date >= Utils.getNextFixingTimestamp();
    }
}