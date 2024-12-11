import XTap from "../components/XTap";
import UserGameDetails from "@/components/UserGameDetails";
import { Wrapper } from "./components/Home/Home.styled";
import TradingItem from "./components/Home/TradingItem";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import pusher from "@/lib/pusher";
import { $http } from "@/lib/http";
import { useUserProfileStore } from "@/store/user-store";
import { SpotType } from "@/types/SpotType";

export default function Home() {
  const [spots, setSpots] = useState<SpotType[]>([]);
  const [loading, setLoading] = useState(true);
  const [validatedAmount, setValidatedAmount] = useState(0);
  const UserTradingUnlock = useUserProfileStore();
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await $http.get("/get-user-trading");
        const allSpots = response.data;
        const unlockedPairs = allSpots.filter((spot: SpotType) =>
          UserTradingUnlock.benefitData.trading_unlocked.map(Number).includes(Number(spot.pair_id))
        );
        setSpots(unlockedPairs);
      } catch (error) {
        console.error("Error fetching spots:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpots();
  
    const channel = pusher.subscribe("pairs");
    channel.bind("data", (data: any) => {
      console.log(data.pairs);
      const unlockedSpots = data.pairs.filter((spot: SpotType) =>
        UserTradingUnlock.benefitData.trading_unlocked.map(Number).includes(Number(spot.pair_id))
      );
      setSpots(unlockedSpots);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [UserTradingUnlock.benefitData.trading_unlocked]);

  const handleValidateAmount = (amount: number) => {
    setValidatedAmount(amount);
  };

  return (
    <Wrapper
      className="flex-1 px-3 pb-20 bg-center bg-cover"
      style={{
        backgroundColor: `#064C7D`,
        backgroundImage: `url(/images/home/bg.png)`,
      }}
    >
      <Header validatedAmount={validatedAmount} />
      <UserGameDetails className="mt-6" data={spots} />
      <XTap validatedAmounts={validatedAmount} />
      <div className="pt-24 pb-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <TradingItem
            spots={spots}
            validatedAmounts={validatedAmount}
            onValidateAmount={handleValidateAmount}
          />
        )}
      </div>
    </Wrapper>
  );
}
