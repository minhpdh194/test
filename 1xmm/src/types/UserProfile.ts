import { Position } from "@/classes/Position";
import { TradingInfo } from "./TradingInfo";
import { Bonus } from "@/classes/Bonus";

export type UserProfile = {
  // Main user profile info
  id: number;
  telegram_id: number;
  first_name: string;
  last_name: string|null;
  username: string|null;
  avatar_id: number;

  // User level related info
  level: number;
  earn_per_tap: number;
  energy_limit: number;
  available_energy: number;

  // User trading realted info
  available_bonuses: Bonus[];
  positions: Position[];
  trading_info: TradingInfo;

  // Login info
  last_login_date: Date;
  login_streak: number;

  // Other User info
  number_of_stars: number;
}
