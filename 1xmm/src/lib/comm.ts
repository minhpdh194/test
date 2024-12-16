import { asyncParallelForEach, BACK_OFF_RETRY } from "async-parallel-foreach";
import { AxiosInstance } from "axios";
import { Position } from "@/classes/Position";

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
          username: user.usernames,
          referral_code: start_param?.replace("ref", ""),
        });
        
        return response.data;
      }

    export async function updatePositions(positions: Position[]): Promise<Position[]> {
        const parallelLimit = 4;
        const results = await asyncParallelForEach(positions, parallelLimit, async (position: Position, ) => {
                return await position.update();
        }, {
          times: 3,
          interval: BACK_OFF_RETRY.exponential()
        });
      
        return results.map(v => v.value as Position);
      }
    
    export async function bonusExpiry(http: AxiosInstance, user_id: number, bonusesToDelete: number[]): Promise<void> {
        await http.post<{success: boolean}, any>("expire_bonuses", {
            user_id: user_id,
            bonus_ids: bonusesToDelete
        });
    }
}