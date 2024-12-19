import { create } from 'zustand';
import { $http } from "@/lib/http";
import { UserProfile } from '@/types/UserProfile';
import { Position } from '@/classes/Position';
import { Pair } from '@/types/Pair';
import { LongShort } from '@/enums';
import { Bonus } from '@/classes/Bonus';
import { Utils } from '@/lib/utils';

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
    if (current_positions.length > 0) throw new Error();

    current_positions.push(...positions);
  },

  AddPosition: async (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[]): Promise<AddingDetails> => {
    // existing_position should be a pointer...
    const existing_position = get().positions.find(p => p.pair.id == pair.id && p.long_short === ls);

    if (existing_position) {
      // hence the code below should update the position in positions directly
      await existing_position.update(pair, ls, amt, lev, bonuses);

      try {
        await $http.post('/clicker/update-position', existing_position);

        set((state) => ({
          next_position_id: state.next_position_id! + 1,
        }));
      } catch (error) {
        console.error('Failed to add position:', error);
      }
      return {
        success: true,
        amount_adjustment: existing_position.amount_adjustment,
        realized_pnl: existing_position.realized_pnl
      };
    } else {
      const position: Position = new Position(get().next_position_id!, pair, ls, amt, lev, Utils.getPositionTimestamp() + 21600, bonuses);
      
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

  ClosePosition: async (position_id: number): Promise<ClosingDetails> => {
    const position = get().positions.find(pos => pos.position_id === position_id);
    if (!position) return {
      success: false, 
      position_amount: 0,
      position_pnl: 0
    };

    const pnl = position.get_PnL(Utils.getPositionTimestamp());
    const index = get().positions.indexOf(position);

    try {
      await $http.post(`/clicker/close-position`, position);

      set((state) => ({
        positions: state.positions.splice(index, 1),
      }));
      return {
        success: true, 
        position_amount: position.amount,
        position_pnl: pnl
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
