import { LevelBenefits } from "@/types/LevelBenefits";

export const levelBenefits: Array<LevelBenefits> = [
    createBenefit(1, [1, 2, 3, 4], 0, 0, 0, 0, 0, 0, 25, 500),
    createBenefit(2, [], 0.05, 0.05, 0.025, 0.025, 5, 5, 50, 1000),
    createBenefit(3, [5, 6], 0.10, 0.15, 0.025, 0.05, 5, 10, 50, 2000),
    createBenefit(4, [], 0.10, 0.25, 0.0, 0.05, 5, 15, 100, 3000),
    createBenefit(5, [7, 8], 0.05, 0.30, 0.05, 0.10, 10, 25, 150, 4500),
    createBenefit(6, [], 0.10, 0.40, 0.0, 0.10, 15, 40, 150, 6000),
    createBenefit(7, [], 0.15, 0.55, 0.0, 0.10, 20, 60, 200, 8000),
    createBenefit(8, [9, 10], 0.10, 0.65, 0.10, 0.20, 10, 70, 200, 10000),
    createBenefit(9, [], 0.15, 0.80, 0.0, 0.20, 10, 80, 300, 12000),
    createBenefit(10, [], 0.20, 1.00, 0.0, 0.20, 10, 90, 350, 14000),
    createBenefit(11, [], 0.15, 1.15, 0.1, 0.30, 10, 100, 350, 17000),
    createBenefit(12, [], 0.15, 1.30, 0.0, 0.30, 20, 120, 500, 20000),
    createBenefit(13, [], 0.20, 1.50, 0.0, 0.30, 10, 130, 500, 24000),
    createBenefit(14, [], 0.20, 1.70, 0.1, 0.40, 10, 140, 1000, 28000),
    createBenefit(15, [], 0.15, 1.85, 0.0, 0.40, 10, 150, 1000, 34000),
    createBenefit(16, [], 0.15, 2.00, 0.0, 0.40, 15, 165, 1000, 40000),
    createBenefit(17, [], 0.20, 2.20, 0.0, 0.40, 15, 180, 1000, 50000),
    createBenefit(18, [], 0.25, 2.45, 0.1, 0.50, 15, 195, 1500, 60000),
    createBenefit(19, [], 0.25, 2.70, 0.0, 0.50, 15, 210, 1600, 80000),
    createBenefit(20, [], 0.30, 3.00, 0.0, 0.50, 15, 225, 2000, 100000),
    createBenefit(21, [], 0.20, 3.20, 0.1, 0.60, 15, 240, 2500, 130000),
    createBenefit(22, [], 0.25, 3.45, 0.0, 0.60, 20, 260, 4000, 160000),
    createBenefit(23, [], 0.25, 3.70, 0.1, 0.70, 20, 280, 4000, 200000),
    createBenefit(24, [], 0.30, 4.00, 0.0, 0.70, 20, 300, 6000, 240000),
    createBenefit(25, [], 0.25, 4.25, 0.1, 0.80, 30, 330, 6000, 300000),
];

function createBenefit(level: number, pairs_unlocked: number[], positive_leverage: number, cumulated_positive_leverage: number,
    protection_bonus: number, cumulated_protection_bonus: number, time_bonus: number, cumulated_time_bonus: number, total_gain_per_tap: number,
    cumulated_tapping_amount: number): LevelBenefits {
    const benefit: LevelBenefits = {
            level: level,
            pairs_unlocked: pairs_unlocked,
            positive_leverage: positive_leverage,
            cumulated_positive_leverage: cumulated_positive_leverage,
            protection_bonus: protection_bonus,
            cumulated_protection_bonus: cumulated_protection_bonus,
            time_bonus: time_bonus,
            cumulated_time_bonus: cumulated_time_bonus,
            total_gain_per_tap: total_gain_per_tap,
            cumulated_tapping_amount: cumulated_tapping_amount
        };

        return benefit;
}