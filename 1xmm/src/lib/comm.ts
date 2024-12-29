import { asyncParallelForEach, BACK_OFF_RETRY } from "async-parallel-foreach";
import { AxiosInstance } from "axios";
import { Position } from "@/classes/Position";
import { LongShort } from "@/enums";
import { Index } from "@/types/Index";
import { Utils } from "./utils";

export type UserData = {
  first_login: boolean;
  login_streak: number;
  token: string;
}

export namespace COMM {
    export async function loadUserData(http: AxiosInstance, user: any, start_param: any): Promise<UserData> {
        var response = await http.post<UserData, any>("/auth/telegram-user", {
          telegram_user_id: user.id?.toString(),
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.first_name + user.last_name,
          referral_code: start_param?.replace("ref", ""),
        });
        
        return response.data;
      }
    
    export async function getIndex(http: AxiosInstance, pairId: number, ls: LongShort, value_date: number): Promise<number|undefined> {
      var response = await http.get("/get-index", {
        params: {
          pair_id: pairId,
          long_short: ls,
          value_date: value_date,
        }
      });

      if (response.data.error) { return undefined; }
      return Number(response.data.index);
    }

    export async function updatePositions(positions: Position[], indices: Index[]): Promise<Position[]> {
        const parallelLimit = 4;
        const updateTime = await Utils.getLastFixingTimestamp();

        const results = await asyncParallelForEach(positions, parallelLimit, async (position: Position, ) => {
            const index = indices.find(v => v.pair_id === position.pair.id && v.long_short === position.long_short)?.value;
            if (!index) return {
              is_zero: false,
              pnl: 0,
              perf: position.performance,
            };
            return position.update(updateTime, index);
        }, {
          times: 3,
          interval: BACK_OFF_RETRY.exponential()
        });
      
        return results.map(v => v.value as Position);
      }
    
    export async function bonusExpiry(http: AxiosInstance, telegram_user_id: number, bonusesToDelete: number[]): Promise<void> {
        await http.post<{success: boolean}, any>("expire_bonuses", {
            telegram_user_id: telegram_user_id,
            bonus_ids: bonusesToDelete
        });
    }
}