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
  SetNextPositionId: (next_position_id: number) => void;
  SetAvailableBonuses: (available_bonuses: Bonus[]) => void;
  SetUserPositions: (positions: Position[]) => void;
}

export const getPositionStore = create<PositionStore>()((set, get) => ({
  next_position_id: -1,
  available_bonuses: [],
  positions: [],

  SetNextPositionId: (next_position_id: number): void => {
    set(() => ({
      next_position_id: next_position_id
    }));
  },

  SetAvailableBonuses: (available_bonuses: Bonus[]): void => {
    set(() => ({
      available_bonuses: available_bonuses
    }));
  },

  SetUserPositions: (positions: Position[]): void => {
    set(() => ({
      positions: positions
    }));
  },

  AddPosition: async (pair: Pair, ls: LongShort, amt: number, lev: number, bonuses: Bonus[], userProfile: UserProfile): Promise<AddingDetails> => {
    const positionStore = get();
    const existing_position = positionStore.positions.find((p) => p.pair.id == pair.id && p.long_short === ls);
console.log(existing_position);
    if (existing_position) {
      const res = await existing_position.update(pair, ls, amt, lev, bonuses);

      try {
        await $http.post('/clicker/update-position', existing_position);
        set((state) => ({
          next_position_id: state.next_position_id! + 1,
          positions: state.positions.map((pos) => pos.position_id == existing_position.position_id ? existing_position : pos),
        }));
      } catch (error) {
        console.error('Failed to add position:', error);
      }
      return {
        success: true,
        amount_adjustment: res.amount_adjustment,
        realized_pnl: res.realized_pnl
      };
    } else {
      const position: Position = new Position(get().next_position_id!, pair, ls, amt, lev, Utils.getPositionTimestamp() + 21600, bonuses, userProfile);
      const res = await position.add(pair, ls, amt, lev, bonuses);
      
      try {
        await $http.post('/clicker/add-position', position);
        set((state) => ({
          next_position_id: state.next_position_id! + 1,
          positions: [...state.positions, position],
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
          amount_adjustment: res.amount_adjustment,
          realized_pnl: res.realized_pnl
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
