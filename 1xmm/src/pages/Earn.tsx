import { earn } from "@/referential/i18nPrefixes";
import Header from "../components/Header";
import ListQuest from "./components/Earn/ListQuest";
import ModalCategory from './components/Earn/ModalCategory';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import ListDailyQuest from "./components/Earn/ListDailyQuest";

export default function Profile() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className="flex-1 px-3 pb-20 bg-center bg-cover"
      style={{
        backgroundColor: `#064C7D`,
        backgroundImage: `url(/images/home/bg.png)`,
      }}
    >
      <Header amount_token={userProfile.amount_of_tokens} />
      <div className="mt-4 mb-8 text-center">
        <span className="fw-bold text-2xl">{t(`${earn}.earn_more_coins`)}</span>
      </div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="fw-bold">
            {t(`${earn}.daily_quests`)}
          </div>
          <div className="flex items-center space-x-1">
            <img
              src="/images/earn/more.png"
              alt="more"
              className="w-4 h-4"
            />
            <span className="text-xs" onClick={() => {
              setOpenDrawer(true);
            }}>{t(`${earn}.more_info`)}</span>
          </div>
        </div>
        <ListDailyQuest />
      </div>

      <div className="b-8">
        <div className="flex justify-between items-center">
          <div className="fw-bold">
            {t(`${earn}.quests_to_do`)}
          </div>
          <div className="flex items-center space-x-1">
            <img
              src="/images/earn/more.png"
              alt="more"
              className="w-4 h-4"
            />
            <span className="text-xs" onClick={() => {
              setOpenDrawer(true);
            }}>{t(`${earn}.more_info`)}</span>
          </div>
        </div>
        <ListQuest />
      </div>
      <ModalCategory
        open={openDrawer}
        onOpenChange={setOpenDrawer}
      />
    </div>
  );
}
