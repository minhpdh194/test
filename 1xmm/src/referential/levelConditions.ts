import { LevelConditions } from "@/types/LevelConditions";

export const levelConditions: Array<LevelConditions> = [
    createCondition(1, 0, 250),
    createCondition(2, 250, 500),
    createCondition(3, 500, 1000),
    createCondition(4, 1000, 1500),
    createCondition(5, 1500, 2500),
    createCondition(6, 2500, 3500),
    createCondition(7, 3500, 5000),
    createCondition(8, 5000, 6500),
    createCondition(9, 6500, 8000),
    createCondition(10, 8000, 10000),
    createCondition(11, 10000, 12500),
    createCondition(12, 12500, 15000),
    createCondition(13, 15000, 17500),
    createCondition(14, 17500, 20000),
    createCondition(15, 20000, 25000),
    createCondition(16, 25000, 30000),
    createCondition(17, 30000, 35000),
    createCondition(18, 35000, 40000),
    createCondition(19, 40000, 50000),
    createCondition(20, 50000, 60000),
    createCondition(21, 60000, 75000),
    createCondition(22, 75000, 90000),
    createCondition(23, 90000, 110000),
    createCondition(24, 110000, 130000),
    createCondition(25, 130000, 150000),
];

function createCondition(level: number, from_balance: number, to_balance: number): LevelConditions {
    let condition: LevelConditions = {
        level: level,
        from_balance: from_balance,
        to_balance: to_balance
    };

    return condition;
};