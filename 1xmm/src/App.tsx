import { RouterProvider } from "react-router-dom";
import PlayOnYourMobile from "./pages/PlayOnYourMobile";
import { useEffect, useState } from "react";
import SplashScreen from "./components/partials/SplashScreen";
import { toast } from "react-toastify";

import router from "./router";
import { $http, setBearerToken } from "./lib/http";
import { COMM } from "@/lib/comm";
import useTelegramInitData from "./hooks/useTelegramInitData";
import { UserProfileStore, userProfileStore } from "./store/user-store";
import { SyncData } from "./types/SyncData";
import { UserBonus } from "./types/UserBonus";
import { UserPosition } from "./types/UserPosition";
import { Pair } from "./types/Pair";
import { Position } from "./classes/Position";
import { Bonus } from "./classes/Bonus";
import { bonusDefinitions } from "./referential/bonusDefinitions";
import { getPositionStore } from "./store/position-store";
import { StarPackage } from "./types/StarPackage";
import { StarPackages } from "./referential/starPackages";
import { Index } from "./types/Index";
import { PusherIndex } from "./types/PusherIndex";
import { SpotType } from "./types/SpotType";
import { LongShort } from "./enums";
import { Utils } from "./lib/utils";
import { UserRanking } from "./types/UserRanking";

const webApp = window.Telegram.WebApp;
const isDesktop = import.meta.env.DEV
  ? false
  : Telegram.WebApp.platform === "tdesktop";

declare global {
  var userProfile: UserProfileStore;
  var spots: SpotType[];
  var globalIndices: PusherIndex[];
  var starPackage: StarPackage[];
  var starsTarget: number;
}

function App() {
  globalThis.userProfile = userProfileStore();
  globalThis.userProfile.positionStore = getPositionStore();
  const data = useTelegramInitData();
  const user = data.user;
  const start_param = data.start_param;
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [, setIsFirstLoad] = useState(false);

  useEffect(() => {
    webApp.setHeaderColor("#000");
    webApp.setBackgroundColor("#000");
    webApp.expand();
  }, []);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user) return () => { };
    setProgress(5);

    const signIn = async () => {
      // Sanity check
      if (user.is_bot) throw new Error('No bot');
      if (user.id == null) throw new Error('No user found');
      let streak = 1;

      try {
        // We load user data
        const response = await COMM.loadUserData($http, user, start_param);

        setProgress(20);

        streak = response.login_streak;

        if (localStorage.getItem("token") === null) {

          setBearerToken(response.token);
          setIsFirstLoad(response.first_login);
        }

        setProgress(25);

        const pairs = await $http.$get<Pair[]>("/pairs");
        localStorage.setItem("PairReferential", JSON.stringify(pairs));

        const [syncData,
          user_bonuses,
          user_positions,
          indices
          //{ data: tasks}
        ] = await Promise.all([
          $http.$get<SyncData>("/clicker/sync"),
          $http.$get<UserBonus[]>("/user_bonuses"),
          $http.$get<{ positions: UserPosition[]; }>("/user_positions"),
          $http.$get<Index[]>("/get-indices"),
          //$http.get("/user_tasks")
        ]);

        setProgress(45);

        const update: PusherIndex[] = [];

        // We convert the indices into globalIndices
        indices.forEach(indexToAdd => {
          const globalIndex = update.find(globInd => globInd.pair_id == indexToAdd.pair_id);
          const isLong = indexToAdd.long_short.toString().toLowerCase() == LongShort.Long.toString().toLowerCase();

          if (globalIndex) {
            if (isLong) globalIndex.long = indexToAdd.value;
            else { globalIndex.short = indexToAdd.value; }
          } else {
            const ts = new Date(indexToAdd.timestamp).getTime() / 1000
            update.push({
              pair_id: indexToAdd.pair_id,
              long: isLong ? indexToAdd.value : 0,
              short: isLong ? 0 : indexToAdd.value,
              time: ts
            })
          }
        });

        // We update the userProfileStore
        syncData['login_streak'] = streak;

        globalThis.globalIndices = update;
        globalThis.userProfile.UpdateProfile(syncData);

        const [availableBonuses, cleanedPositions, bonusesToDelete] = await filterBonusesAndPositions(user_bonuses, user_positions.positions, pairs);

        setProgress(75);

        await COMM.bonusExpiry($http, bonusesToDelete);
        COMM.updatePositions(cleanedPositions);

        globalThis.userProfile.positionStore!.UpdateAvailableBonuses(availableBonuses);
        globalThis.userProfile.positionStore!.SetUserPositions(cleanedPositions);

        setProgress(85);
        globalThis.userProfile.SetLevelBenefits();

        setProgress(95);

        globalThis.starPackage = StarPackages;
        $http.get("/clicker/load-spots");
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load game data');
      }
    };

    setTimeout(() => {
      signIn().then(() => setShowSplashScreen(false));
    }, 2000);
  }, [user]);

  if (showSplashScreen) return <SplashScreen progress={progress} />;
  if (!user || isDesktop) return <PlayOnYourMobile />;

  return <RouterProvider router={router} />;
}

async function filterBonusesAndPositions(userBonuses: UserBonus[], userPositions: UserPosition[], pairs: Pair[]): Promise<[Bonus[], Position[], number[]]> {
  const availableBonuses: Bonus[] = [];
  const openPositions: Position[] = [];
  const bonusesToDelete: number[] = [];

  const timestamp = await Utils.getLastFixingTimestamp();

  userPositions.forEach(p => {
    const date = new Date(p.min_end_date + 'Z').getTime() / 1000;
    const isLong = p.long_short == 'long';

    const open_position: Position = new Position(pairs.find(e => e.id == p.pair_id)!, isLong ? LongShort.Long : LongShort.Short, p.amount, p.index_start, p.average_leverage, date);
    open_position.set_last_update_timestamp(timestamp);

    if (p.bonuses_id) {
      const bonusForPosition: number[] = JSON.parse(p.bonuses_id);

      bonusForPosition.forEach(element => {
        const userBonus = userBonuses.find(b => b.id == element);
        if (!userBonus) throw new Error('Bonus storage mismatch');

        const bonusDef = bonusDefinitions.find(def => def.id == userBonus.bonus_id);
        if (!bonusDef) throw new Error('Bonus definition error');

        const index = userBonuses.indexOf(userBonus);
        userBonuses[index] = userBonuses[userBonuses.length - 1];
        userBonuses.pop();

        const bonus = new Bonus(element, bonusDef);
        const bonus_end_date = new Date(userBonus.end_date! + 'Z').getTime() / 1000;
        bonus.attach_to_position(open_position, bonus_end_date);

        if (!open_position.attach_existing_bonus(bonus)) { bonusesToDelete.push(element); }
      });
    }

    openPositions.push(open_position);
  });

  userBonuses.forEach(b => {
    const bonusDef = bonusDefinitions.find(def => def.id == b.bonus_id);
    if (!bonusDef) throw new Error('Bonus definition error');

    availableBonuses.push(new Bonus(b.id, bonusDef));
  });

  return [availableBonuses, openPositions, bonusesToDelete];
}

export default App;
