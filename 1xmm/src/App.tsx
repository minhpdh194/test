import { RouterProvider } from "react-router-dom";
import express, { Application } from "express";
import bodyParser from 'body-parser';
import { asyncParallelForEach, BACK_OFF_RETRY } from "async-parallel-foreach";
import PlayOnYourMobile from "./pages/PlayOnYourMobile";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import SplashScreen from "./components/partials/SplashScreen";
import { toast } from "react-toastify";

import router from "./router";
import { $http, setBearerToken } from "./lib/http";
import useTelegramInitData from "./hooks/useTelegramInitData";
import { userProfileStore } from "./store/user-store";
import { SyncData } from "./types/SyncData";
import { UserBonus } from "./types/UserBonus";
import { UserPosition } from "./types/UserPosition";
import { Pair } from "./types/Pair";
import { Position } from "./classes/Position";
import { UserProfile } from "./types/UserProfile";
import { Bonus } from "./classes/Bonus";
import { bonusDefinitions } from "./referential/bonusDefinitions";

const webApp = window.Telegram.WebApp;
const isDesktop = import.meta.env.DEV
  ? false
  : Telegram.WebApp.platform === "tdesktop";

function App() {
  const userProfile = userProfileStore();
  const data = useTelegramInitData();
  const user = data.user;
  const start_param = data.start_param;
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [, setIsFirstLoad] = useState(false);
  let pairs: Array<Pair>;

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
      if (user.usernames == null) throw new Error();
      let streak = 1;

      try {
        if (localStorage.getItem("token") === null) {
          // We load user data
          const [ login_streak, token, first_login ] = await loadUserData(user, start_param);
          setProgress(20);

          streak = login_streak;
          setBearerToken(token);
          setIsFirstLoad(first_login);

          setProgress(30);
        }
      
        // Load user details and referential data
        pairs.push(...await $http.$get<Pair[]>("/pairs"));
        setProgress(35);

        const [ syncData,
          user_bonuses,
          user_positions,
          { data: referredUsers},
          { data: tasks}
        ] = await Promise.all([
          $http.$get<SyncData>("/clicker/sync"),
          $http.$get<UserBonus[]>("/user_bonuses"),
          $http.$get<UserPosition[]>("/user_positions"),
          $http.get("/referred-users"),
          $http.get("/user_tasks")
        ]);

        setProgress(55);

        // We update the userProfileStore
        syncData['login_streak'] = streak;
        userProfile.UpdateProfile(syncData);
        // UpdateProfile has updated user level -> we can load the related benefits
        userProfile.SetLevelBenefits();

        setProgress(65);

        const [ availableBonuses, cleanedPositions ] = syncBonusesAndPositions(user_bonuses, user_positions, pairs, userProfile);
        await updatePositions(cleanedPositions)
        
        setProgress(95)

        userProfile.available_bonuses.push(...availableBonuses);
        userProfile.positions.push(...cleanedPositions);

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

async function loadUserData(user: any, start_param: any): Promise<[number, string, boolean]> {
  return await $http.post<{login_streak: number; token: string; first_login: boolean;}, any>("/auth/telegram-user", {
    telegram_id: user.id?.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.usernames,
    referral_code: start_param?.replace("ref", ""),
  });
}

async function updatePositions(positions: Position[]): Promise<Position[]> {
  const parallelLimit = 4;
  const results = await asyncParallelForEach(positions, parallelLimit, async (position: Position, ) => {
          position.update();
          return position;
  }, {
    times: 3,
    interval: BACK_OFF_RETRY.exponential()
  });

  return results.map(v => v.value as Position);
}

function syncBonusesAndPositions(userBonuses: UserBonus[], userPositions: UserPosition[], pairs: Pair[], userProfile: UserProfile): [Bonus[], Position[]] {
  let openPositions: Position[] = [];
  let availableBonuses: Bonus[] = [];

  userPositions.forEach(p => {
    let open_position: Position = new Position(p.position_id, pairs.find(e => e.id == p.pair_id)!, p.long_short, p.amount, p.average_leverage, p.min_end_date, [], userProfile);

    p?.bonuses.forEach(element => {
      const userBonus = userBonuses.find(b => b.id == element);
      if (!userBonus) throw new Error('Bonus storage mismatch');
      const bonusDef = bonusDefinitions.find(def => def.id == userBonus.bonus_id);
      if (!bonusDef) throw new Error('Bonus definition error');
      
      // We delete the attached bonus from the list of userBonuses
      // This process ensures that the bonus is used only 1 time
      const index = userBonuses.indexOf(userBonus);
      userBonuses[index] = userBonuses[userBonuses.length - 1];
      userBonuses.pop();

      // We attach the bonus to the Position p
      open_position.attach_bonus(new Bonus(bonusDef))
    });

    openPositions.push(open_position);
  });

  userBonuses.forEach(b => {
    const bonusDef = bonusDefinitions.find(def => def.id == b.bonus_id);
    if (!bonusDef) throw new Error('Bonus definition error');

    availableBonuses.push(new Bonus(bonusDef));
  });

  return [availableBonuses, openPositions];
}

function launchMessageListener(): void {
  const app: Application = express();
  const PORT = 3000;

  // Middleware to parse JSON requests
  app.use(bodyParser.json());

  // Telegram webhook endpoint
  app.post('/telegram-webhook', (req, res) => {
    const update = req.body;

    // Check if the update contains a message
    if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        console.log(`Received message from chat ID ${chatId}: ${text}`);

        // Check if it's a referral update message
        if (text.startsWith('Referral Update:')) {
            // Extract details from the message
            const match = text.match(/Referral Update: Invitee (.+) connected. Reward: (.+)/);
            if (match) {
                const inviteeName = match[1];
                const rewardDetails = match[2];

                // Handle reward update logic
                handleRewardUpdate(chatId, inviteeName, rewardDetails);
            }
        }
    }

    // Send a 200 response to Telegram
    res.sendStatus(200);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

function handleRewardUpdate(chatId: number, inviteeName: string, rewardDetails: string): void {
  console.log(`Updating reward for chat ID ${chatId}`);
  console.log(`Invitee: ${inviteeName}, Reward: ${rewardDetails}`);

  // TODO: Update inviter's reward in your database or mini-app logic
}

export default App;
