import { Pair } from "./Pair";

export type Volatility = {
  pair_id: number;
  yield: number;
  volatility: number;
  forward: number;
};

export type SpotType = {
  pair_id: number;
  prev_value: number;
  current_value: number;
  daily_return: number;
  id: number;
  pair: Pair;
};
