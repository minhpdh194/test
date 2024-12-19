import { useEffect, useState } from "react";
import Header from "../components/Header";
import { $http } from "@/lib/http";
import DetailBonus from "./components/Bonus/DetailBonus";
import { toast } from "react-toastify";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { BonusTypes } from "@/enums";
import { bonusDefinitions } from "@/referential/bonusDefinitions";
import { Utils } from "@/lib/utils";

const convertSecondsToHours = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}h${formattedMinutes}m${formattedSeconds}s`;
};

export default function Bonus() {
    const [openBonusDrawer, setOpenBonusDrawer] = useState(false);
    const [leverageData, setLeverageData] = useState<any[]>([]);
    const [positiveLeverageData, setPositiveLeverageData] = useState<any[]>([]);
    const [capitalProtectionData, setCapitalProtectionData] = useState<any[]>([]);
    const [timeReductionData, setTimeReductionData] = useState<any[]>([]);
    const [friendData, setFriendData] = useState<any[]>([]);
    const [countdown, setCountdown] = useState<{ [key: string]: number }>({});
    const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
    const [tonConnectUI] = useTonConnectUI();

    const updateBonusData = async () => {
        try {
            const telegramResponse = await $http.get("/user_bonuses");
            const filteredBoughtBonuses = bonusDefinitions.filter((item: any) => telegramResponse.data.includes(item.id));
            console.log(filteredBoughtBonuses);

            setLeverageData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 0));
            setPositiveLeverageData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 1));
            setCapitalProtectionData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 2));
            setTimeReductionData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 3));
            setFriendData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 4));
        } catch (error) {
            console.error("Error fetching bonus data:", error);
        }
    };

    useEffect(() => {
        const checkWalletConnection = async () => {
            if (tonConnectUI.account?.address) {
                console.log(tonConnectUI.account?.address)
                setTonWalletAddress(tonConnectUI.account?.address);
            } else {
                setTonWalletAddress(null);
            }
        };

        checkWalletConnection();
    }, [tonConnectUI]);

    useEffect(() => {
        const fetchBonusData = async () => {
            try {
                const telegramResponse = await $http.get("/user_bonuses");
                const filteredBoughtBonuses = bonusDefinitions.filter((item: any) => telegramResponse.data.includes(item.id));
                console.log(filteredBoughtBonuses);

                setLeverageData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 0));
                setPositiveLeverageData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 1));
                setCapitalProtectionData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 2));
                setTimeReductionData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 3));
                setFriendData(filteredBoughtBonuses.filter((item: any) => item.bonus_type === 4));

                const countdownData: { [key: string]: number } = {};
                telegramResponse.data.forEach((bonus: any) => {
                    if (bonus.end_date) {
                        const remainingTime = bonus.end_date - Math.floor(Date.now() / 1000);
                        countdownData[bonus.id] = remainingTime > 0 ? remainingTime : 0;
                    }
                });
                setCountdown(countdownData);
            } catch (error) {
                console.error("Error fetching bonus data:", error);
            }
        };

        fetchBonusData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prevCountdown) => {
                const updatedCountdown = { ...prevCountdown };
                Object.keys(updatedCountdown).forEach((key) => {
                    if (updatedCountdown[key] > 0) {
                        updatedCountdown[key] -= 1;
                    }
                });
                return updatedCountdown;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const renderBonusItem = (bonus: any) => {
        let formattedDuration = "";
        let countdownClass = "text-white";

        if (countdown[bonus.id] !== undefined) {
            const remainingTime = countdown[bonus.id];
            if (remainingTime > 0) {
                formattedDuration = convertSecondsToHours(remainingTime);
                countdownClass = "text-green-500";
            } else {
                formattedDuration = "Expired";
                countdownClass = "text-red-500";
            }
        } else {
            formattedDuration = convertSecondsToHours(bonus.duration);
        }


        return (
            <div key={bonus.id} className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                <div className="flex fw-bold pb-2 justify-between items-center border-b">
                    <span className="flex items-center space-x-1">
                        <span>{Utils.formatString(BonusTypes[bonus.bonus_type])}</span>
                        <img
                            src="/images/home/polygon.png"
                            alt="polygon"
                            className="w-3 h-2"
                        />
                        <span className="text-xs fw-light">{`+${bonus.benefit}%`}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <img
                            src="/images/home/coin.png"
                            alt="coin"
                            className="w-6 h-6"
                        />
                        <span>{bonus.cost}</span>
                    </span>
                </div>
                <div className="flex pb-2 pt-2 justify-between items-center">
                    <span>Bonus duration</span>
                    <span className={`flex text-sm space-x-1 items-center ${countdownClass}`}>
                        <img
                            src="/images/home/time.png"
                            alt="time"
                            className="w-4 h-4"
                        />
                        <span>{formattedDuration}</span>
                    </span>
                </div>
            </div>
        );
    };

    const handleBuyBonusAction = () => {
        if (tonWalletAddress) {
            setOpenBonusDrawer(true);
        } else {
            toast.error("Please connect your wallet before");
        }
    }

    return (
        <div
            className="flex-1 px-3 pb-20 bg-center bg-cover"
            style={{
                backgroundColor: `#064C7D`,
                backgroundImage: `url(/images/home/bg.png)`,
            }}
        >
            <Header />
            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Leverage</span>
                    <button
                        type="button"
                        className="rounded flex fw-semibold items-center justify-center py-2 px-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]"
                        onClick={() => handleBuyBonusAction()}
                    >
                        <img
                            src="/images/home/coin.png"
                            alt="coin"
                            className="object-cover w-4 h-4"
                        />
                        <span className="font-normal text-xs">Purchase Bonus</span>
                    </button>
                </div>
                <div className="flex flex-col">
                    {leverageData.length > 0 ? (
                        leverageData.map(renderBonusItem)
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>)}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Positive Leverage</span>
                </div>
                <div className="flex flex-col">
                    {positiveLeverageData.length > 0 ? (
                        positiveLeverageData.map(renderBonusItem)
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>)}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Capital Protection</span>
                </div>
                <div className="flex flex-col">
                    {capitalProtectionData.length > 0 ? (
                        capitalProtectionData.map(renderBonusItem)
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>)}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Time Reduction</span>
                </div>
                <div className="flex flex-col">
                    {timeReductionData.length > 0 ? (
                        timeReductionData.map(renderBonusItem)
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>)}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Friends</span>
                </div>
                <div className="flex flex-col">
                    {friendData.length > 0 ? (
                        friendData.map(renderBonusItem)
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>)}
                </div>
            </div>

            {openBonusDrawer && (
                <DetailBonus
                    open={openBonusDrawer}
                    // bonusData={bonusData}  
                    onOpenChange={setOpenBonusDrawer}
                    onBuySuccess={updateBonusData}
                />
            )}

        </div>
    );
}
