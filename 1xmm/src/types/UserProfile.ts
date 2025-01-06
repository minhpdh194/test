import { TradingInfo } from "./TradingInfo";

export type UserProfile = {
  // Main user profile info

  // Main user profile info
  id: number;
  telegram_user_id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  avatar_id: number;

  // User level related info
  level: number;
  earn_per_tap: number;
  energy_limit: number;
  available_energy: number;
  amount_of_tokens: number;

  // User trading realted info
  trading_info: TradingInfo;

  // Login info
  start_date: Date;
  last_login: Date;
  login_streak: number;

  number_of_stars: number;
}
