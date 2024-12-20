import { Pair } from "./Pair";

export type Volatility = {
  pair_id: number;
  yield: number;
  volatility: number;
  forward: number;
};

export type SpotType = {
  pair_id: number;
  fixing_period: number;
  day_open_value: number;
  period_open_value: number;
  prev_value: number;
  current_value: number;
  period_return: number;
  daily_return: number;
  id: number;
  pair: Pair;
};
