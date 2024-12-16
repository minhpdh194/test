import { userProfileStore } from "@/store/user-store";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import ListFriend from "./components/Friends/ListFriend";
import ListBonus from "./components/Friends/ListBonus";
import { $http } from "@/lib/http";

const shareMessage = encodeURI(
  "Play 1xMM with me!"
);

export default function Friends() {
  const [, copy] = useCopyToClipboard();
  const { telegram_user_id } = userProfileStore();
  // const { referral, levels } = uesStore();
  const [activeType, setActiveType] = useState('1');
  const [referedUsers, setReferedUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchReferedFriends = async () => {
      const response = await $http.get("/referred-users");
      setReferedUsers(response.data.data)
    }

    fetchReferedFriends();
  }, []);

  const referralLink = useMemo(
    () => `${import.meta.env.VITE_BOT_URL}/?startapp=ref${telegram_user_id}`,
    [telegram_user_id]
  );

  return (
    <div className="flex-1 px-3 pb-20 bg-center bg-cover"
      style={{
        backgroundColor: `#064C7D`,
        backgroundImage: `url(/images/friends/bg.png)`,
      }}>
      <Header />
      <div className="mt-6 w-100">
        <span className="flex justify-center fw-bolder text-2xl">Invite Friends!</span>
        <span className="flex text-center text-sm">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</span>
        <div className="flex justify-between mt-4 gap-2">
          <div className="bg-[#32363C] rounded-lg relative w-48 h-30">
            <div className="relative w-full">
              <img
                src="/images/home/coin.png"
                alt="coin"
                className="h-8 w-8 absolute -top-5 left-1/2 transform -translate-x-1/2"
              />
            </div>
            <div className="text-center p-1 pt-3">
              <span className="text-[#F79841] text-xl fw-bold">+ 20,000</span>
              <span className="text-xs block">for you & friends </span>
            </div>
          </div>
          <div className="w-48 bg-[#32363C] rounded-lg relative">
            <div className="relative w-full">
              <img
                src="/images/home/coin.png"
                alt="coin"
                className="h-8 w-8 absolute -top-5 left-1/2 transform -translate-x-1/2"
              />
            </div>
            <div className="text-center p-1 pt-3">
              <span className="text-[#F79841] text-xl fw-bold">+ 25,000</span>
              <span className="text-xs block">for you & friends if he has account Premium </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4 gap-2">
          <div className="border-[#ffffff] border-1 py-2 rounded-lg w-48 h-30 text-center">
            <button className="fw-bold text-sm" onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${shareMessage}&url=${referralLink}`
              )
            }>Share invite link</button>
          </div>
          <div className="text-center py-2 rounded-lg w-48 h-30" style={{ background: `linear-gradient(142.18deg, #5155DA 21.85%, #2B2D74 78.15%)` }}>
            <button type="button" className="fw-bold text-sm" onClick={() => {
              copy(referralLink);
              toast.success("Referral link copied to clipboard");
            }}>Copy invite link</button>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="p-3 rounded-lg w-100 text-center" style={{ background: `linear-gradient(142.18deg, #5155DA 21.85%, #2B2D74 78.15%)` }}>
            <button className="fw-bold text-sm" onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${shareMessage}&url=${referralLink}`
              )
            }>Invite Friend</button>
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4">
        <span className="text-md">Friends</span>
        <div className="bg-[#32363C] rounded-xl mt-2">
          <div className="gap-4">
            <div className="flex p-3 pb-1 gap-2">
              <button
                className={`p-2 text-sm w-50 rounded-xl ${activeType === '1' ? 'bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] fw-bold' : 'bg-[#1F1F1F]'}`}
                onClick={() => setActiveType('1')}
              >
                Referrals
              </button>
              <button
                className={`w-50 text-sm p-2 rounded-xl ${activeType === '2' ? 'bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] fw-bold' : 'bg-[#1F1F1F]'}`}
                onClick={() => setActiveType('2')}
              >
                Bonuses
              </button>
            </div>
            <div className="p-3 pt-0">
              {activeType === '1' && (
                <div className="tab-content">
                  {referedUsers && referedUsers.map((user) => (
                    <ListFriend key={user.id} referedUser={user} />
                  ))}
                </div>
              )}
              {activeType === '2' && (
                <div className="tab-content">
                  <ListBonus />
                  <ListBonus />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
