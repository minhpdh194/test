import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import ListFriend from "./components/Friends/ListFriend";
import { Friend } from "@/types/Friend";
import { $http } from "@/lib/http";
import pusher from "@/lib/pusher";
import { useTranslation } from "react-i18next";

const shareMessage = encodeURI(
  "Play 1xMM with me!"
);

export default function Friends() {
  const [, copy] = useCopyToClipboard();
  // const { referral, levels } = uesStore();
  const [friends, setFriends] = useState<Friend[]>(globalThis.userInvitedFriends);
  const prefix = "friends";
  const { t } = useTranslation();

  const appLink = useMemo(
    () => `${import.meta.env.VITE_BOT_URL}/?startapp=ref${userProfile.telegram_user_id}`,
    [userProfile.telegram_user_id]
  );

  /*const referralLink = useMemo(
    () => `${import.meta.env.VITE_API_URL}/invite-user?ref=${userProfile.telegram_user_id}`,
    [userProfile.telegram_user_id]
  );*/
  
  useEffect(() => {
    const notification = pusher.subscribe(`refer_noti_user_${userProfile.telegram_user_id}`);
    notification.bind("data", async () => {
      fetchFriendsData();
    });
  }, [globalThis.userInvitedFriends]);

  async function fetchFriendsData() {
    const response = await $http.get("/referred-users");
    setFriends(response.data.referred_friends);
  }

  return (
    <div className="flex-1 px-3 pb-20 bg-center bg-cover"
      style={{
        backgroundColor: `#064C7D`,
        backgroundImage: `url(/images/home/bg.png)`,
      }}>
      <Header amount_token={userProfile.amount_of_tokens} />
      <div className="mt-6 w-100">
        <span className="flex justify-center fw-bolder text-2xl">{t(`${prefix}.invite_friends`)}</span>
        <span className="flex text-center text-sm">{t(`${prefix}.description`)}</span>
        <div className="flex justify-center mt-4 gap-2">
          <div className="bg-[#32363C] rounded-lg relative w-80 h-30">
            <div className="relative w-full">
              <img
                src="/images/home/coin.png"
                alt="coin"
                className="h-8 w-8 absolute -top-5 left-1/2 transform -translate-x-1/2"
              />
            </div>
            <div className="flex-center text-center p-1 pt-3">
              <span className="text-[#F79841] text-xl fw-bold">+ 20,000</span>
              <span className="text-xs block">{t(`${prefix}.bonus_for`)}</span>
            </div>
            <div className="flex-center text-center  p-2">
              <span className="text-sm block font-bold py-1">
                {t(`${prefix}.extra.invite`)} <span className="text-[#3fba6c] fw-bold">3</span> {t(`${prefix}.extra.friends`)}, {t(`${prefix}.extra.get_extra`)} <span className="text-[#ebe242] fw-bold">25,000</span><br/>
                {t(`${prefix}.extra.invite`)} <span className="text-[#3fba6c] fw-bold">6</span> {t(`${prefix}.extra.friends`)}, {t(`${prefix}.extra.get_extra`)} <span className="text-[#ebe242] fw-bold">50,000</span><br/>
                {t(`${prefix}.extra.invite`)} <span className="text-[#3fba6c] fw-bold">10</span> {t(`${prefix}.extra.friends`)}, {t(`${prefix}.extra.get_extra`)} <span className="text-[#ebe242] fw-bold">100,000</span><br/>
                {t(`${prefix}.extra.invite`)} <span className="text-[#3fba6c] fw-bold">25</span> {t(`${prefix}.extra.friends`)}, {t(`${prefix}.extra.get_extra`)} <span className="text-[#ebe242] fw-bold">250,000</span><br/>
                {t(`${prefix}.extra.invite`)} <span className="text-[#3fba6c] fw-bold">50</span> {t(`${prefix}.extra.friends`)}, {t(`${prefix}.extra.get_extra`)} <span className="text-[#ebe242] fw-bold">500,000</span><br/>
                {t(`${prefix}.extra.invite`)} <span className="text-[#3fba6c] fw-bold">100</span> {t(`${prefix}.extra.friends`)}, {t(`${prefix}.extra.get_extra`)} <span className="text-[#ebe242] fw-bold">1,000,000</span>
              </span>
            </div>
          </div>
          {/*<div className="w-48 bg-[#32363C] rounded-lg relative">
            <div className="relative w-full">
              <img
                src="/images/home/coin.png"
                alt="coin"
                className="h-8 w-8 absolute -top-5 left-1/2 transform -translate-x-1/2"
              />
            </div>
            <div className="text-center p-1 pt-3">
              <span className="text-[#F79841] text-xl fw-bold">+ 40,000</span>
              <span className="text-xs block">{t(`${prefix}.bonus_for_premium`)}</span>
            </div>
          </div>*/}
        </div>
        <div className="flex justify-between mt-4 gap-2">
          <div className="border-[#ffffff] border-1 py-2 rounded-lg w-48 h-30 text-center">
            <button className="fw-bold text-sm" onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${shareMessage}&url=${appLink}`
              )
            }>{t(`${prefix}.share_invite_link`)}</button>
          </div>
          <div className="text-center py-2 rounded-lg w-48 h-30" style={{ background: `linear-gradient(142.18deg, #5155DA 21.85%, #2B2D74 78.15%)` }}>
            <button type="button" className="fw-bold text-sm" onClick={() => {
              copy(appLink);
              toast.success("Referral link copied to clipboard");
            }}>{t(`${prefix}.copy_invite_link`)}</button>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <div className="p-3 rounded-lg w-100 text-center" style={{ background: `linear-gradient(142.18deg, #5155DA 21.85%, #2B2D74 78.15%)` }}>
            <button className="fw-bold text-sm" onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${shareMessage}&url=${appLink}`
              )
            }>{t(`${prefix}.invite_friends`)}</button>
          </div>
        </div>
      </div>
      <div className="mt-3 mb-4">
        <span className="text-md">{t(`${prefix}.friends`)}</span>
        <div className="bg-[#32363C] rounded-xl mt-2">
          <div className="gap-4">
            <div className="flex p-3 pb-1 gap-2">
              <button
                className={`p-2 text-sm w-full rounded-xl bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] fw-bold`}
              >
                {t(`${prefix}.referrals`)}
              </button>
            </div>
            <div className="p-3 pt-0">
                <div className="tab-content">
                  <ListFriend referedUsers={friends} />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
