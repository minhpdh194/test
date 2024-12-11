import { Pair } from "./Pair";

export type Volatility = {
  pair_id: number;
  yield: number;
  volatility: number;
  forward: number;
};

export type SpotType = {
  id: number;
  position_id: number;
  pair_id: number;
  pair?: Pair;
  prev_value: string;
  value: number;
  return: string;
  timestamp: string;
  volatility?: Volatility;
};
