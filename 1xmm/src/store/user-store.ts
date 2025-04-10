import { create } from "zustand";
import { toast } from "react-toastify";
import { $http } from "../lib/http";
import { UserProfile } from "@/types/UserProfile";
import { PositionStore } from "./position-store";
import { SyncData } from "@/types/SyncData";
import { Bonus } from "@/classes/Bonus";
import { Pair } from "@/types/Pair";
import { LongShort } from "@/enums";

// Referential data
import { levelBenefits } from "@/referential/levelBenefits";
import { levelConditions } from "@/referential/levelConditions";
import { BonusDefinition } from "@/types/BonusDefinition";
import { bonusDefinitions } from "@/referential/bonusDefinitions";

export type UserProfileStore = UserProfile & {
  SetLevelBenefits: () => void;
  UpdateProfile: (syncData: SyncData) => void;
  UserTap: () => boolean;
  UserLevelUp: () => void;
  AddPosition: (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[]) => Promise<number | undefined>;
  ClosePosition: (position_id: number) => Promise<number>;
  AddBonusesToPosition: (position_id: number, bonuses: Bonus[]) => Promise<void>;
  BuyBonus: (bonus: BonusDefinition) => void;
  BuyToken: (bonus: BonusDefinition) => void;
  BuyFriendsBonus: (bonus: BonusDefinition) => void;
  UpdateBalance: (newBalance: number) => void;
  UpdateUserAvatar: (avatar_id: number) => void;
  UpdateUserWallet: (crypto_id: number, wallet_address: string) => void;
  UpdateTotalFriends: (friends: number) => void;
  LegalTermsValidated: () => void;
  RefreshEnergy: () => void;
  unlocked_pair_ids: Array<number>;
  unlocked_pairs: Pair[];
  available_task_ids: Array<number>;
  completed_task_ids: Array<number>;
  completed_daily_task_ids: Array<number>;
  completed_tasks: Array<any>;
  positionStore: PositionStore | undefined;
  lastEnergyUpdate: number;
}

export const userProfileStore = create<UserProfileStore>()((set, get) => ({
  // Main user profile info
  id: 0,
  telegram_user_id: 0,
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
  amount_of_tokens: 0,
  positionStore: undefined,
  trading_info: {
    balance: 0,
    total_pnl: 0,
    perf_from_start_date: 0,
    positive_leverage: 0,
    capital_protection: 0,
    time_reduction: 0
  },

  // Login info
  start_date: new Date(0),
  last_login: new Date(0),
  login_streak: 0,

  // Other
  number_of_stars: 0,
  unlocked_pair_ids: [],
  unlocked_pairs: [],

  available_task_ids: [],
  completed_task_ids: [],
  completed_tasks: [],
  completed_daily_task_ids: [],

  selected_crypto: -1,
  wallet_address: "",
  total_friends_refered: 0,
  hasValidatedLegalTerms: false,
  lastEnergyUpdate: Date.now() * 0.001,

  UpdateUserWallet: (crypto_id: number, wallet_address: string) => {
    set(() => ({
      selected_crypto: crypto_id,
      wallet_address: wallet_address,
    }));
  },

  UpdateTotalFriends: (friends: number) => {
    set((state) => ({
      total_friends_refered: state.total_friends_refered + friends,
    }));
  },

  UpdateUserAvatar: (avatar_id: number) => {
    set(() => ({
      avatar_id: avatar_id,
    }));
  },

  SetLevelBenefits: () => {
    const pairsInReferential = JSON.parse(localStorage.getItem("PairReferential") || "[]") as Pair[];
    const userLevel = get().level;

    let benefits = levelBenefits.find((b) => b.level == userLevel);
    // If there is no benefit for the level, we use the last benefits
    if (!benefits) benefits = levelBenefits[levelBenefits.length - 1];

    const unlocked_pair_ids = get().unlocked_pair_ids;
    getUnlockedPairIds(userLevel).forEach(id => { if (!unlocked_pair_ids.find(nid => nid == id)) unlocked_pair_ids.push(id) });

    const unlocked_pairs = get().unlocked_pairs;
    getUnlockedPairs(pairsInReferential, userLevel).forEach(p => { if (!unlocked_pairs.find(np => np.id == p.id)) unlocked_pairs.push(p) });

    set((state) => ({
      earn_per_tap: benefits.total_gain_per_tap,
      energy_limit: benefits.cumulated_tapping_amount,
      trading_info: {
        balance: state.trading_info.balance,
        total_pnl: state.trading_info.total_pnl,
        perf_from_start_date: state.trading_info.perf_from_start_date,
        positive_leverage: benefits.cumulated_positive_leverage,
        capital_protection: benefits.cumulated_protection_bonus,
        time_reduction: benefits.cumulated_time_bonus
      },
      unlocked_pair_ids: unlocked_pair_ids,
      unlocked_pairs: unlocked_pairs
    }));
  },

  BuyBonus: async (bonus: BonusDefinition) => {
    try {
      const response = await $http.post('/buy-bonus', { bonus: bonus });
      if (response.status === 200) {
        toast.success('Bonus bought successfully!');
        const userProfile = get();
        if (userProfile.positionStore) {
          const responseBonus = response.data.bonus;
          const bonusDef = bonusDefinitions.find(def => def.id == responseBonus.bonus_id);

          if (responseBonus && bonusDef) {
            const addedBonus = new Bonus(bonusDef.id, bonusDef);
            userProfile.positionStore.AddAvailableBonus(addedBonus);
          }
        }
      } else if (response.status === 202) {
        toast.warning(response.data.success);
      }
      else {
        toast.error('Failed to buy bonus!');
      }
    } catch (error) {
      toast.error('An error occurred while buying the bonus!');
    }
  },

  BuyToken: async (bonus: BonusDefinition) => {
    try {
      const response = await $http.post('/buy-token', { bonus: bonus });
      if (response.status === 200) {
        toast.success('Token bought successfully!');
        set((state) => ({
          amount_of_tokens: state.amount_of_tokens + bonus.benefit,
        }));
      } else if (response.status === 202) {
        toast.warning(response.data.success);
      }
      else {
        toast.error('Failed to buy token!');
      }
    } catch (error) {
      toast.error('An error occurred while buying the token!');
    }
  },

  BuyFriendsBonus: async (bonus: BonusDefinition) => {
    try {
      const response = await $http.post('/buy-friend', { bonus: bonus });
      if (response.status === 200) {
        toast.success('Friend bonus bought successfully!');
        set((state) => ({
          total_friends_refered: state.total_friends_refered + bonus.benefit,
        }));
      } else if (response.status === 202) {
        toast.warning(response.data.success);
      }
      else {
        toast.error('Failed to buy token!');
      }
    } catch (error) {
      toast.error('An error occurred while buying the token!');
    }
  },

  UpdateBalance: (newBalance: number) => {
    set((state) => ({
      trading_info: {
        ...state.trading_info,
        balance: state.trading_info.balance + newBalance,
      },
      amount_of_tokens: state.amount_of_tokens + newBalance,
    }));
  },

  UpdateProfile: (syncData: SyncData) => {
    set((state) => ({
      id: syncData.user.id,
      telegram_user_id: syncData.user.telegram_user_id,
      first_name: syncData.user.first_name,
      last_name: syncData.user.last_name,
      username: syncData.user.username,
      start_date: syncData.user.start_date,
      last_login: syncData.user.last_login,
      level: Number(syncData.gameData.level),
      login_streak: Number(syncData.user.login_streak),
      avatar_id: syncData.gameData.avatar_id,
      available_energy: Number(syncData.gameData.available_energy),
      energy_limit: Number(syncData.gameData.energy_limit),
      amount_of_tokens: Number(syncData.gameData.amount_of_tokens),
      trading_info: {
        balance: parseFloat(syncData.gameData.balance),
        total_pnl: parseFloat(syncData.gameData.total_pnl),
        perf_from_start_date: parseFloat(syncData.gameData.perf_from_start_date),
        positive_leverage: Number(state.trading_info.positive_leverage),
        capital_protection: state.trading_info.capital_protection,
        time_reduction: Number(state.trading_info.time_reduction),
      },
      number_of_stars: Number(syncData.gameData.number_of_stars),
      selected_crypto: Number(syncData.gameData.crypto),
      wallet_address: syncData.gameData.wallet_address,
      total_friends_refered: syncData.gameData.total_friends_refered,
      hasValidatedLegalTerms: syncData.user.hasValidatedLegalTerms
    }));

    globalThis.userProfile = get(); //assign newest data to global
  },

  LegalTermsValidated: () => {
    set(() => ({
      hasValidatedLegalTerms: true,
    }));
  },

  UserTap: () => {
    const gainPerTap = get().earn_per_tap;
    const currentAvailableEnergy = get().available_energy;

    if (currentAvailableEnergy < gainPerTap) { return false; }
    set((state) => ({
      available_energy:  state.available_energy - gainPerTap,
      amount_of_tokens: state.amount_of_tokens + gainPerTap,
      trading_info: {
        balance: state.trading_info.balance + gainPerTap,
        total_pnl: state.trading_info.total_pnl,
        perf_from_start_date: state.trading_info.perf_from_start_date,
        positive_leverage: state.trading_info.positive_leverage,
        capital_protection: state.trading_info.capital_protection,
        time_reduction: state.trading_info.time_reduction
      },
      // We store the last tap timestamp in seconds
      lastTapTimestamp: Date.now() * 0.001,
    }));
    
    return true;
  },

  UserLevelUp: async () => {
    const pairsInReferential = JSON.parse(localStorage.getItem("PairReferential") || "[]") as Pair[];
    const userPnl = get().trading_info.total_pnl;

    const matchedCondition = levelConditions
      .find((condition) => userPnl >= condition.from_balance && userPnl < condition.to_balance);

    if (matchedCondition && get().level < matchedCondition.level) {
      const benefits = levelBenefits.find((benef) => benef.level == matchedCondition.level);
      if (!benefits) return;

      const unlocked_pair_ids = get().unlocked_pair_ids;
      getUnlockedPairIds(matchedCondition.level).forEach(id => { if (!unlocked_pair_ids.find(nid => nid == id)) unlocked_pair_ids.push(id) });

    const unlocked_pairs = get().unlocked_pairs;
      getUnlockedPairs(pairsInReferential, matchedCondition.level).forEach(p => {

        if (!unlocked_pairs.find(np => np.id == p.id)) {
          unlocked_pairs.push(p)
        }
      });

      const result = await updateUserLevel(matchedCondition.level, benefits.cumulated_tapping_amount);
      
      if (result) {
        set((state) => ({
          level: matchedCondition.level,
          trading_info: {
            balance: state.trading_info.balance,
            total_pnl: state.trading_info.total_pnl,
            perf_from_start_date: state.trading_info.perf_from_start_date,
            positive_leverage: benefits.cumulated_positive_leverage,
            capital_protection: benefits.cumulated_protection_bonus,
            time_reduction: benefits.cumulated_time_bonus
          },
          earn_per_tap: benefits.total_gain_per_tap,
          energy_limit: benefits.cumulated_tapping_amount,
          available_energy: state.available_energy + (benefits.cumulated_tapping_amount - state.energy_limit),
          unlocked_pair_ids: unlocked_pair_ids,
          unlocked_pairs: unlocked_pairs
        }));

        toast.success(`You have leveled up to level ${matchedCondition.level}`);
      } else {
        toast.error("Unexpected error has been occurred");
      }

    }
  },

  AddPosition: async (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[]): Promise<number | undefined> => {
    const userProfile = get();
    if (!userProfile.positionStore) return 0;

    const addDetails = await userProfile.positionStore!.AddPosition(pair, ls, amt, lev, bonuses);

    if (addDetails.success) {
      set((state) => ({
        amount_of_tokens: state.amount_of_tokens + addDetails.realized_pnl,
        trading_info: {
          balance: state.trading_info.balance + addDetails.amount_adjustment + addDetails.realized_pnl,
          total_pnl: state.trading_info.total_pnl + addDetails.realized_pnl,
          perf_from_start_date: (state.trading_info.perf_from_start_date * state.amount_of_tokens + addDetails.realized_pnl) / state.amount_of_tokens,
          positive_leverage: state.trading_info.positive_leverage,
          capital_protection: state.trading_info.capital_protection,
          time_reduction: state.trading_info.time_reduction
        },
      }))
      get().UserLevelUp();

      return addDetails.amount_adjustment + addDetails.realized_pnl;
    }

    return undefined;
  },

  AddBonusesToPosition: async (position_id: number, bonuses: Bonus[]): Promise<void> => {
    const userProfile = get();
    if (!userProfile.positionStore) return;

    await userProfile.positionStore.AddBonusesToPosition(position_id, bonuses);
  },

  ClosePosition: async (position_id: number): Promise<number> => {
    const positionStore = get().positionStore;
    if (!positionStore) return 0;

    const closingDetails = await positionStore!.ClosePosition(position_id);

    if (closingDetails.success) {
      set((state) => ({
        amount_of_tokens: state.amount_of_tokens + closingDetails.position_pnl,
        trading_info: {
          balance: state.trading_info.balance + closingDetails.position_amount + closingDetails.position_pnl,
          total_pnl: state.trading_info.total_pnl + closingDetails.position_pnl,
          perf_from_start_date: state.trading_info.perf_from_start_date + closingDetails.position_pnl / state.amount_of_tokens,
          positive_leverage: state.trading_info.positive_leverage,
          capital_protection: state.trading_info.capital_protection,
          time_reduction: state.trading_info.time_reduction
        },
      }));
      get().UserLevelUp();
    }

    return closingDetails.position_amount + closingDetails.position_pnl;
  },

  RefreshEnergy: () => {
    const userProfile = get();
    const energyLimit = userProfile.energy_limit;

    // We get the current timestamp in seconds
    const currentTime = Date.now() * 0.001;
    // We increase energy every 10 seconds
    const nIncrease = Math.floor((currentTime +0.01 - userProfile.lastEnergyUpdate!) / 30);
    
    // Energy is fully restored every 3 hours
    const energyGain = Math.ceil(nIncrease / 360 * energyLimit);
    const newAvailableEnergy = Math.min(userProfile.available_energy + energyGain, energyLimit);

    set(() => ({
      available_energy: newAvailableEnergy,
      lastEnergyUpdate: newAvailableEnergy == energyLimit ? undefined : currentTime,
    }));
  }
}));

async function updateUserLevel(newLevel: number, new_energy_limit: number) {
    try {
    const response = await $http.post('/update-user-level', {
        level: newLevel,
        energy_limit: new_energy_limit
      });
    return response.data.success;
    } catch (error) {
      console.log(error);
      return false;
    }
}

function getUnlockedPairIds(level: number): number[] {
  const pairs: number[] = [];

  levelBenefits.filter((benefit) => benefit.level <= level)
      .forEach((benefit) => {
        pairs.push(...benefit.pairs_unlocked)
      });

  return pairs;
}

function getUnlockedPairs(pairsInReferential: Pair[], level: number): Pair[] {
   let pairs: Pair[] = [];
   const pairIds = getUnlockedPairIds(level);
   pairIds.forEach(id => pairs.push(pairsInReferential.find(p => p.id == id)!))
   return pairs;
}