import Header from "../components/Header";
import ListQuest from "./components/Earn/ListQuest";
import ModalCategory from './components/Earn/ModalCategory';
import { useState } from 'react';
// import { useUserStore } from "@/store/user-store";
export default function Profile() {
  // const user = useUserStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div
      className="flex-1 px-3 pb-20 bg-center bg-cover"
      style={{
        backgroundColor: `#064C7D`,
        backgroundImage: `url(/images/home/bg.png)`,
      }}
    >
      <Header />
      <div className="mt-4 mb-8 text-center">
        <span className="fw-bold text-2xl">Earn more Coins</span>
        <img
          src="/images/earn/shilling.png"
          alt="money"
          className="w-20 h-24 absolute top-35 transform -translate-x-1/2"
          style={{
            left: `15%`
          }}
        />
        <div className="bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] p-2 rounded-xl mt-3" style={{ float: `inline-end`, width: `90%` }}>
          <div className="flex justify-between p-1">
            <span className="text-end fw-bold">
            </span>
            <span className="text-end fw-bold text-lg">
              Daily reward
            </span>
            <span className="text-end">
              <span className="fw-bold">10</span>h :  <span className="fw-bold">10</span>m : <span className="fw-bold">10</span>s
            </span>
          </div>
          <span className="text-center text-sm">Hurry up and get it</span>
        </div>
      </div>
      <div className="mt-28 mb-8">
        <div className="flex justify-between items-center">
          <div className="fw-bold">
            Quests To Do
          </div>
          <div className="flex items-center space-x-1">
            <img
              src="/images/earn/more.png"
              alt="more"
              className="w-4 h-4"
            />
            <span className="text-xs" onClick={() => {
              setOpenDrawer(true);
            }}>More Info</span> 
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
