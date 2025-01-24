import { create } from 'zustand';
import { $http } from "@/lib/http";
import { PnLResult, Position } from '@/classes/Position';
import { Pair } from '@/types/Pair';
import { LongShort } from '@/enums';
import { Bonus } from '@/classes/Bonus';
import { Utils } from '@/lib/utils';
import { COMM } from '@/lib/comm';

export type AddingDetails = {
  success: boolean;
  amount_adjustment: number;
  realized_pnl: number;
}

export type ClosingDetails = {
  success: boolean;
  position_amount: number;
  position_pnl: number;
}

export type PositionsUpdate = {
  pnl_results: PnLResult[];
  total_change_in_amount_of_tokens: number;
  total_change_in_pnl: number;
}

export type PositionStore = {
  available_bonuses: Bonus[];
  positions: Position[];

  AddPosition: (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[]) => Promise<AddingDetails>;
  UpdatePosition: (position_id: number, new_bonuses: Bonus[]) => Promise<void>;
  ClosePosition: (position_id: number) => Promise<ClosingDetails>;
  UpdateAvailableBonuses: (available_bonuses: Bonus[]) => void;
  AddAvailableBonus: (bonus: Bonus) => void;
  AddBonusesToPosition: (position_id: number, bonuses: Bonus[]) => Promise<void>;
  SetUserPositions: (positions: Position[]) => void;
  RefreshPositions: () => Promise<PositionsUpdate>;
  CleanBonuses: () => void;
}

export const getPositionStore = create<PositionStore>()((set, get) => ({
  available_bonuses: [],
  positions: [],

  UpdateAvailableBonuses: (available_bonuses: Bonus[]): void => {
    set(() => ({
      available_bonuses: available_bonuses
    }));
  },

  AddAvailableBonus: (bonus: Bonus): void => {
    get().available_bonuses.push(bonus);
  },

  AddBonusesToPosition: async (position_id: number, bonuses: Bonus[]): Promise<void> => {
    const position = get().positions.find(p => p.position_id === position_id);
    if (!position) return;

    const newly_attached_bonuses = bonuses.map(b => {
      position.attach_new_bonus(b);
      const check_bonus = position.get_bonus_end_date(b);

      if (!check_bonus.is_attached || !check_bonus.end_date) throw new Error('Bonus not attached to position');
      return { id: b.id, end_date: check_bonus.end_date! };
    });

    const new_available_bonuses = get().available_bonuses.filter(b => !newly_attached_bonuses.find(nb => nb.id == b.id));

    try {
      await $http.post(`/clicker/update-position`, { position: position, new_bonuses: newly_attached_bonuses, pnl: 0 });
      set((state) => ({
        positions: state.positions.map((pos) => (pos.position_id === position_id ? position : pos)),
        available_bonuses: new_available_bonuses
      }));
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  },

  CleanBonuses: () => {
    get().positions.forEach(p => p.remove_expired_bonuses());
  },

  SetUserPositions: (positions: Position[]): void => {
    const current_positions = get().positions;
    current_positions.push(...positions);
  },

  AddPosition: async (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[]): Promise<AddingDetails> => {
    // existing_position should be a pointer...
    const existing_position = get().positions.find(p => p.pair.id == pair.id);

    if (existing_position) {
      // hence the code below should update the position in positions directly
      const res = existing_position.add(ls, amt, lev, bonuses);

      const new_bonuses = bonuses.map(b => {
        const check_bonus = existing_position.get_bonus_end_date(b);

        if (!check_bonus.is_attached || !check_bonus.end_date) throw new Error('Bonus not attached to position');
        return { id: b.id, end_date: check_bonus.end_date! };
      });

      try {
        if (existing_position.amount == 0) {
          await $http.post('clicker/close-position', { position: existing_position, pnl: res.realized_pnl });
        } else {
          await $http.post('/clicker/update-position', { position: existing_position, new_bonuses: new_bonuses, pnl: res.realized_pnl });
        }
      } catch (error) {
        console.error('Failed to add position:', error);
      }

      return {
        success: true,
        amount_adjustment: res.amount_adjustment,
        realized_pnl: res.realized_pnl
      };
    } else {
      const index_value = COMM.getIndex(pair.id, ls);

      if (index_value == undefined) {
        return {
          success: false,
          amount_adjustment: 0,
          realized_pnl: 0
        };
      }

      const index_at_start = index_value.value;
      const value_date = index_value.timestamp;

      const position: Position = new Position(pair, ls, Number(amt), index_at_start!, lev, value_date + 21600);
      position.set_last_update_timestamp(value_date);
      bonuses.forEach(b => position.attach_new_bonus(b));

      try {
        await $http.post('/clicker/add-position', { position: position, bonus_end_dates: position.bonuses.map(b => b.end_date!) });
      } catch (error) {
        return {
          success: false,
          amount_adjustment: 0,
          realized_pnl: 0
        };
      }

      set((state) => ({
        positions: [...state.positions, position],
      }));

      return {
        success: true,
        amount_adjustment: -amt,
        realized_pnl: 0
      };
    }
  },

  UpdatePosition: async (position_id: number, new_bonuses: Bonus[]) => {
    const position = get().positions.find(pos => pos.position_id === position_id);
    if (!position) return;

    position.set_last_update_timestamp(await Utils.getLastFixingTimestamp());

    const newly_attached_bonuses = new_bonuses.map(b => {
      const check_bonus = position.get_bonus_end_date(b);

      if (!check_bonus.is_attached || !check_bonus.end_date) throw new Error('Bonus not attached to position');
      return { id: b.id, end_date: check_bonus.end_date! };
    });

    try {
      await $http.post(`/clicker/update-position`, { position: position, new_bonuses: newly_attached_bonuses, pnl: 0 });
      set((state) => ({
        positions: state.positions.map((pos) => (pos.position_id === position_id ? position : pos)),
      }));
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  },

  RefreshPositions: async (): Promise<PositionsUpdate> => {
    let pnl_results: PnLResult[] = [];
    let positions_to_remove: number[] = [];
    let total_change_in_amount_of_tokens = 0;
    let total_change_in_pnl = 0;

    const positions = get().positions;

    for (let i = 0; i < positions.length; i++) {
      const index = globalThis.globalIndices.find(v => v.pair_id === positions[i].pair.id);
      if (!index) continue;

      const value_date = index.time;
      const index_value =  positions[i].long_short == LongShort.Long ? index.long : index.short;
      const pnlResult = positions[i].update(value_date, index_value);

      pnl_results.push(pnlResult);
      total_change_in_pnl += pnlResult.pnl;

      if (pnlResult.is_zero) {
        await $http.post(`/clicker/close-position`, { position: positions[i], pnl: pnlResult.pnl });
        total_change_in_amount_of_tokens -= positions[i].amount;
        positions_to_remove.push(positions[i].position_id);
      }
    }

    // Going backwards to avoid index shifting
    set((state) => ({
      positions: state.positions.filter(pos => {
        if (!positions_to_remove.find(id => id == pos.position_id)) return pos;
      }),
    }));

    return {
      pnl_results,
      total_change_in_amount_of_tokens,
      total_change_in_pnl
    };
  },

  ClosePosition: async (position_id: number): Promise<ClosingDetails> => {
    const position = get().positions.find(pos => pos.position_id === position_id);

    if (!position) return {
      success: false,
      position_amount: 0,
      position_pnl: 0
    };

    const pnl = position.get_PnL();

    try {
      await $http.post(`/clicker/close-position`, { position: position, pnl: pnl.pnl });

      set((state) => ({
        positions: state.positions.filter((pos) => { if (pos.position_id !== position_id) return pos; }),
      }));
      return {
        success: true,
        position_amount: position.amount,
        position_pnl: pnl.pnl
      };

    } catch (error) {
      console.error('Failed to close position:', error);
      return {
        success: false,
        position_amount: 0,
        position_pnl: 0
      };
    }
  }
}));
