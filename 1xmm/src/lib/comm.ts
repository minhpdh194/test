import { AxiosInstance } from "axios";
import { Position } from "@/classes/Position";
import { LongShort } from "@/enums";
import { Index } from "@/types/Index";

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
    
    export function getIndex(pairId: number, ls: LongShort): Index|undefined {
      var index = globalThis.globalIndices.find(v => v.pair_id === pairId);
      if (!index) return undefined;

      return {
        pair_id: pairId,
        long_short: ls,
        value: ls == LongShort.Long ? index.long : index.short,
        timestamp: index.time
      }
    }

    export function updatePositions(positions: Position[]): void {
      positions.forEach(position => {
        const index = globalThis.globalIndices.find(v => v.pair_id === position.pair.id);
        if (index) {
          position.update(index.time, position.long_short == LongShort.Long ? index.long : index.short);
        }
      });
    }
    
    export async function bonusExpiry(http: AxiosInstance, bonusesToDelete: number[]): Promise<void> {
        if (bonusesToDelete.length > 0) await http.post("/expiry_bonuses", { bonus_ids: bonusesToDelete });
    }

    export async function getCoinTarget(http: AxiosInstance): Promise<number> {
      var response = await http.get("/total-coins");
      return Number(response.data['total_coins']);
    }

    export async function updateLegalTermValidation(http: AxiosInstance, user_id: string, validated: boolean): Promise<void> {
      await http.post("/update_legalterms", { telegram_user_id: user_id, validated: validated });
    };
}