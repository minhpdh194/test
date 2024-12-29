import { create } from 'zustand';
import { $http } from "@/lib/http";
import { UserProfile } from '@/types/UserProfile';
import { PnLResult, Position } from '@/classes/Position';
import { Pair } from '@/types/Pair';
import { LongShort } from '@/enums';
import { Bonus } from '@/classes/Bonus';
import { Utils } from '@/lib/utils';
import { COMM } from '@/lib/comm';
import { toast } from 'react-toastify';
import { Index } from '@/types/Index';

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
  next_position_id: number;
  available_bonuses: Bonus[];
  positions: Position[];

  AddPosition: (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[], userProfile: UserProfile) => Promise<AddingDetails>;
  UpdatePosition: (position_id: number) => Promise<void>;
  ClosePosition: (position_id: number) => Promise<ClosingDetails>;
  UpdateAvailableBonuses: (available_bonuses: Bonus[]) => void;
  AddNewBonus: (bonus: Bonus) => void;
  SetUserPositions: (positions: Position[]) => void;
  RefreshPositions: (indices: Index[]) => Promise<PositionsUpdate>;
}

export const getPositionStore = create<PositionStore>()((set, get) => ({
  next_position_id: -1,
  available_bonuses: [],
  positions: [],

  UpdateAvailableBonuses: (available_bonuses: Bonus[]): void => {
    const stored_available_bonuses = get().available_bonuses;

    // First we remove bonuses which are no more available (i.e. not in available_bonuses)
    for (let i = stored_available_bonuses.length - 1; i > 0; i--) {
      if (!available_bonuses.find(ab => ab.id == stored_available_bonuses[i].id)) {
        stored_available_bonuses[i] = stored_available_bonuses[stored_available_bonuses.length - 1];
        stored_available_bonuses.pop();
      };
    }

    // We add bonuses which are available but not in stored_available_bonuses
    available_bonuses.forEach(b => { if (!stored_available_bonuses.find(sb => sb.id == b.id)) stored_available_bonuses.push(b); });
  },

  AddNewBonus: (bonus: Bonus): void => {
    get().available_bonuses.push(bonus);
  },

  SetUserPositions: (positions: Position[]): void => {
    const current_positions = get().positions;

    // Sanity check
    // If we sent the positions, the current positions length must always be 0
    // if (current_positions.length > 0) throw new Error();

    current_positions.push(...positions);
  },

  AddPosition: async (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[]): Promise<AddingDetails> => {
    // existing_position should be a pointer...
    const existing_position = get().positions.find(p => p.pair.id == pair.id);

    if (existing_position) {
      // hence the code below should update the position in positions directly
      const res = await existing_position.add(ls, amt, lev, bonuses);

      try {
        if (existing_position.amount == 0) {
          await $http.post('clicker/close-position', existing_position);
        } else {
          await $http.post('/clicker/update-position', existing_position);
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
        toast.error('Failed to get index for the pair');
        return {
          success: false,
          amount_adjustment: 0,
          realized_pnl: 0
        };
      }

      const index_at_start = index_value.value;
      const value_date = index_value.timestamp;

      const position: Position = new Position(get().next_position_id!, pair, ls, Number(amt), index_at_start!, lev, value_date + 21600, bonuses);
      
      try {
        await $http.post('/clicker/add-position', position);
        get().positions.push(position);

        set((state) => ({
          next_position_id: state.next_position_id! + 1,
        }));
        
        return {
          success: true,
          amount_adjustment: -amt,
          realized_pnl: 0
        };
      } catch (error) {
        console.error('Failed to add position:', error);
        return {
          success: false,
          amount_adjustment: 0,
          realized_pnl: 0
        };
      }
    }
  },

  UpdatePosition: async (position_id: number) => {
    const position = get().positions.find(pos => pos.position_id === position_id);
    if (!position) return;

    try {
      await $http.post(`/clicker/update-position`, position);
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
    const value_date = await Utils.getLastFixingTimestamp();

    for (let i = 0; i < positions.length; i++) {
      const index = indices.find(v => v.pair_id === positions[i].pair.id);
      if (!index) continue;

      const index_value =  positions[i].long_short == LongShort.Long ? index.long : index.short;

      const pnlResult = positions[i].update(value_date, index_value);
      pnl_results.push(pnlResult);
      total_change_in_pnl += pnlResult.pnl;

      if (pnlResult.is_zero) {
        await $http.post(`/clicker/close-position`, positions[i]);
        total_change_in_amount_of_tokens -= positions[i].amount;
        positions_to_remove.push(i);
      }
    }

    // Going backwards to avoid index shifting
    for (let i = positions_to_remove.length - 1; i > 0; i--) {
      set((state) => ({
        positions: state.positions.splice(positions_to_remove[i], 1),
      }));
    }

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

    const pnl = await position.get_PnL();
    const index = get().positions.indexOf(position);

    try {
      await $http.post(`/clicker/close-position`, position);

      set((state) => ({
        positions: state.positions.splice(index, 1),
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
