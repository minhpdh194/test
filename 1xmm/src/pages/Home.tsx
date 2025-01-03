import XTap from "../components/XTap";
import UserGameDetails from "@/components/UserGameDetails";
import { Wrapper } from "./components/Home/Home.styled";
import TradingItem from "./components/Home/TradingItem";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import pusher from "@/lib/pusher";
import { SpotType } from "@/types/SpotType";
import { PusherIndex } from "@/types/PusherIndex";

export default function Home() {
  const [spots, setSpots] = useState<SpotType[]>([]);
  const [amtOfTokens, setAmountOfTokens] = useState<number>(userProfile.amount_of_tokens);
  const [loading, setLoading] = useState(true);
  const [changeInBalance, setChangeInBalance] = useState(0);

  useEffect(() => {
    const pairs = pusher.subscribe("pairs");
    const indices = pusher.subscribe("indices");

    pairs.bind("data", (data: any) => {
      const unlockedSpots = data.pairs.filter((spot: SpotType) =>
        userProfile.unlocked_pair_ids.map(Number).includes(Number(spot.pair_id))
      );
      globalThis.spots = unlockedSpots;
      setSpots(unlockedSpots);
    });

    indices.bind("data", (data: any) => {
      const unlockedIndices = data.indices.filter((index: PusherIndex) =>
        userProfile.unlocked_pair_ids.map(Number).includes(Number(index.pair_id))
      );
      globalThis.globalIndices = unlockedIndices;
      console.log('Refreshing');

      globalThis.userProfile.positionStore?.RefreshPositions();
    });
    
    if (globalThis.spots) {
      setSpots(globalThis.spots);
    }
    console.log(userProfile);
    setLoading(false);

    return () => {
      pairs.unbind_all();
      pairs.unsubscribe();
      indices.unbind_all();
      indices.unsubscribe();
    };

  }, [globalThis.userProfile.unlocked_pair_ids]);

  const updateTokenAmountAfterTap = () => {
    setAmountOfTokens(() => {
      return userProfile.amount_of_tokens + userProfile.earn_per_tap;
    });
  };

  const handleValidatePosition = (amount: number) => {
    setChangeInBalance(amount);
  };

  return (
    <Wrapper
      className="flex-1 px-3 pb-20 bg-center bg-cover"
      style={{
        backgroundColor: `#064C7D`,
        backgroundImage: `url(/images/home/bg.png)`,
      }}
    >
      <Header amount_token={amtOfTokens} />
      <UserGameDetails className="mt-6" data={spots} />
      <XTap changeInBalance={changeInBalance} updateAmountOfTokens={updateTokenAmountAfterTap} />
      <div className="pt-24 pb-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <TradingItem
            spots={spots}
            onValidatePosition={handleValidatePosition}
          />
        )}
      </div>
    </Wrapper>
  );
}
