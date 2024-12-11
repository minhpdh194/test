import { create } from "zustand";
import { toast } from "react-toastify";
import { $http } from "../lib/http";
import { UserProfile } from "@/types/UserProfile";
import { SyncData } from "@/types/SyncData";

// Referential data
import { levelBenefits } from "@/referential/levelBenefits";
import { levelConditions } from "@/referential/levelConditions";
import { stat } from "fs";

type UserProfileStore = UserProfile & {
  SetLevelBenefits: () => void;
  UpdateProfile: (syncData: SyncData) => void;
  UserTap: () => boolean;
  UserLevelUp: () => void;
  unlocked_pairs: number[];
}

export const userProfileStore = create<UserProfileStore>()((set, get) => ({
  // Main user profile info
  id: 0,
  telegram_id: 0,
  first_name: "",
  last_name: "",
  username: "",
  avatar_id: 0,
  
  // User level related info
  level: 0,
  earn_per_tap: 0,
  energy_limit: 0,
  available_energy: 0,

  // User trading realted info
  available_bonuses: [],
  positions: [],
  trading_info: {
    balance: 0,
    total_pnl: 0,
    perf_from_start_date: 0,
    perf_since_last_fixing: 0,
    positive_leverage: 0,
    capital_protection: 0,
    time_reduction: 0
  },

  // Login info
  last_login_date: new Date(0),
  login_streak: 0,
  
  // Other
  number_of_stars: 0,
  unlocked_pairs: [],

  SetLevelBenefits: () => {
    const userLevel = get().level;
    
    let benefits = levelBenefits.find((b) => b.level == userLevel);
    // If there is no benefit for the level, we use the last benefits
    if (!benefits) benefits = levelBenefits[levelBenefits.length - 1];

    set((state) => ({
      earn_per_tap: benefits.total_gain_per_tap,
      energy_limit_level: benefits.cumulated_tapping_amount,
      trading_info: {
        balance: state.trading_info.balance,
        total_pnl: state.trading_info.total_pnl,
        perf_from_start_date: state.trading_info.perf_from_start_date,
        perf_since_last_fixing: state.trading_info.perf_since_last_fixing,
        positive_leverage: benefits.cumulated_positive_leverage,
        capital_protection: benefits.cumulated_protection_bonus,
        time_reduction: benefits.cumulated_time_bonus
      },
      unlocked_pairs: getUnlockedPairs(userLevel)
    }));
  },

  UpdateProfile: (syncData: SyncData) => {
    set((state) => ({
      id: syncData.user.id,
      last_login_date: syncData.user.last_login_date,
      level: syncData['gameData']['level'],
      login_streak: syncData['login_streak'],
      avatar_id: syncData['gameData']['avatar_id'],
      available_energy: syncData['gameData']['available_energy'],
      trading_info: {
        balance: syncData['gameData']['balance'],
        total_pnl: syncData['gameData']['total_pnl'],
        perf_from_start_date: syncData['gameData']['perf_from_start_date'],
        perf_since_last_fixing: syncData['gameData']['perf_since_last_fixing'],
        positive_leverage: state.trading_info.positive_leverage,
        capital_protection: state.trading_info.capital_protection,
        time_reduction: state.trading_info.time_reduction,
      },
      number_of_stars: syncData['gameData']['number_of_stars'],
    }));
  },

  UserTap: () => {
    const gainPerTap = get().earn_per_tap;
    const currentAvailableEnergy = get().available_energy;

    if (currentAvailableEnergy < gainPerTap) { return false; }

    set((state) => ({
      available_energy:  state.available_energy - gainPerTap,
      trading_info: {
        balance: state.trading_info.balance + gainPerTap,
        total_pnl: state.trading_info.total_pnl,
        perf_from_start_date: state.trading_info.perf_from_start_date,
        perf_since_last_fixing: state.trading_info.perf_since_last_fixing,
        positive_leverage: state.trading_info.positive_leverage,
        capital_protection: state.trading_info.capital_protection,
        time_reduction: state.trading_info.time_reduction
      }
    }));

    return true;
  },

  UserLevelUp: async () => {
    const userPnl = get().trading_info.total_pnl; 
    const currentLevel = get().level;
        
    const matchedCondition = levelConditions
      .find((condition) => userPnl >= condition.from_balance && userPnl < condition.to_balance && condition.level == currentLevel + 1);
      
    if (matchedCondition) {
      const benefits = levelBenefits.find((benef) => benef.level == matchedCondition.level);
      if (!benefits) return;

      await updateUserLevel(matchedCondition.level);
      
      set((state) => ({
        level: state.level + 1,
        trading_info: {
          balance: state.trading_info.balance,
          total_pnl: state.trading_info.total_pnl,
          perf_from_start_date: state.trading_info.perf_from_start_date,
          perf_since_last_fixing: state.trading_info.perf_since_last_fixing,
          positive_leverage: benefits.cumulated_positive_leverage,
          capital_protection: benefits.cumulated_protection_bonus,
          time_reduction: benefits.cumulated_time_bonus
        },
        earn_per_tap: benefits.total_gain_per_tap,
        energy_limit_level: benefits.cumulated_tapping_amount,
        unlocked_pairs: getUnlockedPairs(matchedCondition.level),
      }));
      
      toast.success(`You have leveled up to level ${matchedCondition.level}`);
    }
  }
}));

async function updateUserLevel(newLevel: number) {
  let response: boolean = false;
  let count = 0;

  do {
    count++;

    try {
      const r = await $http.post('/update-user-level', {
        level: newLevel
      });
      response = r.data.success;
    } catch (error) {
      response = false;
    }
  } while (!response && count < 10);

  if (!response) throw new Error("Issue communicating with server");
}

function getUnlockedPairs(level: number): number[] {
  let pairs: number[] = [];

  levelBenefits.filter((benefit) => benefit.level <= level)
      .forEach((benefit) => {
        pairs.push(...benefit.pairs_unlocked)
      });

  return pairs;
}