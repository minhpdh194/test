import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppBar from "../AppBar";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { PopupMessageType } from "@/types/PopupMessageType";
import PopupMessageDialog from "../PopupMessageDialog";
import pusher from "@/lib/pusher";
import { toast } from "react-toastify";

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const popupMessgae = useQuery({
    queryKey: ["popup-message"],
    queryFn: () => $http.$get<PopupMessageType>("/popups"),
  });

  useEffect(() => {
    const notification = pusher.subscribe(`refer_noti_user_${userProfile.telegram_user_id}`);
    notification.bind("data", async (data: any) => {
      const invitee = data.invitee;
      const increasedBalance = data.increasedBalance;
      const firstName = invitee.first_name ? invitee.first_name : ""
      const lastName = invitee.last_name ? invitee.last_name : ""
      toast.success(`Your friend ${firstName} ${lastName} just accept your invite. You get ${increasedBalance} balance`);
      userProfile.UpdateBalance(userProfile.trading_info.balance + increasedBalance);
      await fetchGlobalFriendsData();
    });
  }, []);

  async function fetchGlobalFriendsData() {
    const response = await $http.get("/referred-users");
    globalThis.userInvitedFriends = response.data.referred_friends
  }

  useEffect(() => {
    if (pathname !== "/") {
      window.Telegram.WebApp.BackButton.show();
    } else {
      window.Telegram.WebApp.BackButton.hide();
    }
  }, [pathname]);

  useEffect(() => {
    window.Telegram.WebApp.BackButton.onClick(() => {
      navigate("/");
    });
  }, []);

  return (
    <main className="flex flex-col w-full max-w-lg h-[--tg-viewport-height] mx-auto text-white">
      <Outlet />
      <AppBar />
      <PopupMessageDialog message={popupMessgae.data} />
    </main>
  );
}
