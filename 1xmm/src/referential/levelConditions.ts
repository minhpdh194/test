import { LevelConditions } from "@/types/LevelConditions";

export const levelConditions: Array<LevelConditions> = [
    createCondition(1, 0, 250),
    createCondition(2, 250, 500),
    createCondition(3, 500, 1_000),
    createCondition(4, 1_000, 2_000),
    createCondition(5, 1_500, 3_500),
    createCondition(6, 2_500, 6_000),
    createCondition(7, 4_000, 10_000),
    createCondition(8, 6_000, 15_000),
    createCondition(9, 10_000, 20_000),
    createCondition(10, 15_000, 30_000),
    createCondition(11, 20_000, 40_000),
    createCondition(12, 30_000, 60_000),
    createCondition(13, 40_000, 80_000),
    createCondition(14, 60_000, 100_000),
    createCondition(15, 80_000, 125_000),
    createCondition(16, 100_000, 150_000),
    createCondition(17, 125_000, 200_000),
    createCondition(18, 150_000, 250_000),
    createCondition(19, 200_000, 300_000),
    createCondition(20, 250_000, 400_000),
    createCondition(21, 300_000, 500_000),
    createCondition(22, 400_000, 750_000),
    createCondition(23, 500_000, 1_000_000),
    createCondition(24, 1_000_000, 2_000_000),
    createCondition(25, 2_000_000, 10_000_000_000), // Last level has a significant barrier up since we don't want anyone to go above
];

function createCondition(level: number, from_balance: number, to_balance: number): LevelConditions {
    let condition: LevelConditions = {
        level: level,
        from_balance: from_balance,
        to_balance: to_balance
    };

    return condition;
};