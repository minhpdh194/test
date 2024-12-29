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
import { Friend } from "./types/Friend";
import { getPositionStore } from "./store/position-store";
import { StarPackage } from "./types/StarPackage";
import { StarPackages } from "./referential/starPackages";
import { Index } from "./types/Index";
import { PusherIndex } from "./types/PusherIndex";
import { SpotType } from "./types/SpotType";
import pusher from "./lib/pusher";
//import { UserProfile } from "./types/UserProfile";
//import { SpotType } from "./types/SpotType";
//import pusher from "./lib/pusher";

const webApp = window.Telegram.WebApp;
const isDesktop = import.meta.env.DEV
  ? false
  : Telegram.WebApp.platform === "tdesktop";

declare global {
  var userProfile: UserProfileStore;
  var spots: SpotType[];
  var globalIndices: PusherIndex[];
  var starPackage: StarPackage[];
}

function App() {
  globalThis.userProfile = userProfileStore();
  const positionStore = getPositionStore();
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
          indices,
          referredUsers,
          //{ data: tasks}
        ] = await Promise.all([
          $http.$get<SyncData>("/clicker/sync"),
          $http.$get<UserBonus[]>("/user_bonuses"),
          $http.$get<{ next_position_id: number; positions: UserPosition[]; }>("/user_positions"),
          $http.$get<PusherIndex[]>("/get-indices-perf"),
          $http.$get<Friend[]>("/referred-users"),
          //$http.get("/user_tasks")
        ]);

        setProgress(45);

        // We update the userProfileStore
        syncData['login_streak'] = streak;

        globalThis.userProfile.UpdateProfile(syncData);

        //const [availableBonuses, cleanedPositions, bonusToDelete] = syncBonusesAndPositions(user_bonuses, user_positions.positions, pairs);
        const [availableBonuses, cleanedPositions] = syncBonusesAndPositions(user_bonuses, user_positions.positions, pairs);

        setProgress(55);
        // await COMM.bonusExpiry($http, userProfile.id, bonusesToDelete);
        // await COMM.updatePositions(cleanedPositions);
        positionStore!.UpdateAvailableBonuses(availableBonuses);
        positionStore!.SetUserPositions(cleanedPositions);
        positionStore!.next_position_id = user_positions.next_position_id;
        await positionStore.RefreshPositions(indices);

        setProgress(65);
        globalThis.userProfile.SetLevelBenefits();
        globalThis.userProfile.UpdateUserOpenedPosition(positionStore);
        setProgress(95);

        globalThis.userProfile.SetFriends(referredUsers);
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

function syncBonusesAndPositions(userBonuses: UserBonus[], userPositions: UserPosition[], pairs: Pair[]): [Bonus[], Position[], number[]] {
  const availableBonuses: Bonus[] = [];
  const openPositions: Position[] = [];
  const bonusesToDelete: number[] = [];

  userPositions.forEach(p => {
    const date = new Date(p.min_end_date).getTime() / 1000;
    const open_position: Position = new Position(p.id, pairs.find(e => e.id == p.pair_id)!, p.long_short, p.amount, p.index_start, p.average_leverage, date, []);
    //need to use the userProfile in this part, because when this function is called, the global.userProfile is not set, so all of it is default data, which is wrong

    // p?.bonuses.forEach(element => { 
    //    const userBonus = userBonuses.find(b => b.id == element);
    //    if (!userBonus) throw new Error('Bonus storage mismatch');
    //    const bonusDef = bonusDefinitions.find(def => def.id == userBonus.bonus_id);
    //    if (!bonusDef) throw new Error('Bonus definition error');

    //    // We delete the attached bonus from the list of userBonuses
    //    // This process ensures that the bonus is used only 1 time
    //    const index = userBonuses.indexOf(userBonus);
    //    userBonuses[index] = userBonuses[userBonuses.length - 1];
    //    userBonuses.pop();

    //    // We attach the bonus to the Position p
    //    if (!open_position.attach_bonus(new Bonus(element, bonusDef))) { bonusesToDelete.push(element); }
    //   });
    //  //check later after review all pair features
    //This function causes error, i dont want to make any conflict about reviewing later, so i will do this part after we move to bonus features

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
