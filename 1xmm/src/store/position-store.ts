import { create } from 'zustand';
import { $http } from "@/lib/http";
import { Position } from '@/classes/Position';
import { useUserProfileStore } from './user-store';

interface PositionStore {
  positions: Position[];
  fetchPositions: (pairId?: number) => Promise<void>;
  addPosition: (position: Position) => Promise<void>;
  updatePosition: (position: Position) => Promise<void>;
  setPositions: (positions: Position[]) => void;
  currentTotalLongPositionAmount: { [key: string]: number };
  currentTotalShortPositionAmount: { [key: string]: number };
  prevTotalLongPositionAmount: { [key: string]: number };
  prevTotalShortPositionAmount: { [key: string]: number };
}

export const usePositionStore = create<PositionStore>((set) => ({
  positions: [],
  currentTotalLongPositionAmount: {},
  currentTotalShortPositionAmount: {},
  prevTotalLongPositionAmount: {},
  prevTotalShortPositionAmount: {},

  fetchPositions: async () => {
    try {
      const [positionsResponse, ratiosResponse] = await Promise.all([
        $http.get('/clicker/get-position'),
        $http.get('/clicker/get-position-ratios')
      ]);

      const userProfile = useUserProfileStore.getState();

      const positions = positionsResponse.data.map((pos: any) => new Position(
        pos.id,
        pos.position_id,
        pos.pair_symbol,
        pos.long_short,
        pos.amount,
        pos.average_leverage,
        pos.bonuses || [],
        pos.open_return,
        pos.current_value,
        userProfile
      ));

      set({
        positions,
        currentTotalLongPositionAmount: ratiosResponse.data.current_total_long_position,
        currentTotalShortPositionAmount: ratiosResponse.data.current_total_short_position,
        prevTotalLongPositionAmount: ratiosResponse.data.prev_total_long_position,
        prevTotalShortPositionAmount: ratiosResponse.data.prev_total_short_position
      });

      // Log the position data

      set({ positions });
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  },

  addPosition: async (position: Position) => {
    try {
      const response = await $http.post('/clicker/add-position', position);
      set((state) => ({
        positions: [...state.positions, response.data],
      }));
    } catch (error) {
      console.error('Failed to add position:', error);
    }
  },

  updatePosition: async (position: Position) => {
    try {
      const response = await $http.post(`/clicker/update-position/${position.id}`, position);
      set((state) => ({
        positions: state.positions.map((pos) => (pos.id === position.id ? response.data : pos)),
      }));
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  },

  setPositions: (positions: Position[]) => {
    set({ positions });
  },
}));
