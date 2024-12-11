export type LevelBenefits = {
    level: number;
    pairs_unlocked: number[];
    positive_leverage: number;
    cumulated_positive_leverage: number;
    protection_bonus: number;
    cumulated_protection_bonus: number;
    // Time fields are in minutes!!
    time_bonus: number;
    cumulated_time_bonus: number;
    total_gain_per_tap: number;
    cumulated_tapping_amount: number;
  };