import { useEffect, useState } from "react";
import Header from "../components/Header";
//import { $http } from "@/lib/http";
import DetailBonus from "./components/Bonus/DetailBonus";
import { toast } from "react-toastify";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { bonusDefinitions } from "@/referential/bonusDefinitions";
import { BonusDefinition } from "@/types/BonusDefinition";
import { BonusTerms, BonusTypes } from "@/enums";
import DetailStar from "@/components/partials/components/Star/DetailStar";

export default function Bonus() {
    const [openBonusDrawer, setOpenBonusDrawer] = useState(false);
    const [bonusDef, setBonusDef] = useState<any[]>([]);
    const [leverageData, setLeverageData] = useState<any[]>([]);
    const [positiveLeverageData, setPositiveLeverageData] = useState<any[]>([]);
    const [capitalProtectionData, setCapitalProtectionData] = useState<any[]>([]);
    const [timeReductionData, setTimeReductionData] = useState<any[]>([]);
    const [friendData, setFriendData] = useState<any[]>([]);
    const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
    const [tonConnectUI] = useTonConnectUI();
    const [openStarDrawer, setOpenStarDrawer] = useState(false);

    const updateBonusData = async () => {
        try {
            throw new Error("Need to send update of buying purchase to server");
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
                const telegramResponse = bonusDefinitions;
                setBonusDef([...telegramResponse]);

                setLeverageData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.Leverage));
                setPositiveLeverageData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.PositiveLeverage));
                setCapitalProtectionData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.CapitalProtection));
                setTimeReductionData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.TimeReduction));
                setFriendData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.Friends));

                const countdownData: { [key: string]: number } = {};
                telegramResponse.forEach((bonus: BonusDefinition) => {
                    if (bonus.duration != BonusTerms.None) {
                        countdownData[bonus.id] = bonus.duration;
                    }
                });
                // No need countdown here...
                //setCountdown(countdownData);
            } catch (error) {
                console.error("Error fetching bonus data:", error);
            }
        };

        fetchBonusData();
    }, []);

    // What is the use of this function?
    // Why do we have a countdown in the bonus area, where users are only supposed to buy?
    //useEffect(() => {
    //    const interval = setInterval(() => {
    //        setCountdown((prevCountdown) => {
    //            const updatedCountdown = { ...prevCountdown };
    //            Object.keys(updatedCountdown).forEach((key) => {
    //                if (updatedCountdown[key] > 0) {
    //                    updatedCountdown[key] -= 1;
    //                }
    //            });
    //            return updatedCountdown;
    //        });
    //    }, 1000);
    //
    //    return () => clearInterval(interval);
    //}, []);

    const renderBonusItem = (bonus: BonusDefinition) => {
        const toString = (bonusType: BonusTypes) => {
            switch (bonusType) {
                case BonusTypes.Leverage: return "Leverage";
                case BonusTypes.CapitalProtection: return "Capital Protection";
                case BonusTypes.PositiveLeverage: return "Positive Leverage";
                case BonusTypes.TimeReduction: return "Time Reduction";
                case BonusTypes.Friends: return "Friends";
            }
        }

        return (
            <div key={bonus.id} className="w-full bg-[#32363C] rounded-xl p-2.5 mt-3">
                <div className="flex fw-semibold pb-1 justify-between items-center">
                    <span className="flex items-center space-x-8">
                        <span>{toString(bonus.bonus_type)}</span>
                        <span className="text-md fw-light">{`+${bonus.benefit}
                        ${bonus.bonus_type == BonusTypes.CapitalProtection ? '%' : ''}
                        ${bonus.bonus_type == BonusTypes.TimeReduction ? 'sec' : ''}`}</span>
                    </span>
                    {bonus.bonus_type != BonusTypes.Friends ? getBonusDuration(bonus.duration) : ''}
                    <span className="flex items-center space-x-1">
                        <img
                            src="/images/home/star.png"
                            alt="coin"
                            className="w-6 h-6"
                        />
                        <span>{bonus.cost}</span>
                    </span>
                </div>
            </div>
        );
    };

    const getBonusDuration = (bonusTerm: BonusTerms) => {
        return (
            <span className="flex text-sm space-x-1 items-center text-white">
                <img
                    src="/images/home/time.png"
                    alt="time"
                    className="w-4 h-4"
                />
                <span>{bonusTerm == BonusTerms.Short ? "3 hours" : "6 hours"}</span>
            </span>);
    }

    const handleBuyStarsAction = () => {
        if (tonWalletAddress) {
            setOpenStarDrawer(true);
        } else {
            toast.error("Please connect your wallet before");
        }
    }

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
            <div className="mt-5 mb-8">
                <div className="italic text-sm">
                    Purchasing bonus entitles to receive 1XMM coins at a ratio of 0.30cts per token, as long as the total allocation amount has not been reached.
                    Check our website to see whether bonus allocated tokens are still available.
                </div>
            </div>
            <div className="flex justify-around mt-4 mb-6">
                <button
                    type="button"
                    className="rounded flex fw-semibold py-2 px-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]"
                    onClick={() => handleBuyBonusAction()}
                >
                    <img
                        src="/images/home/star.png"
                        alt="coin"
                        className="object-cover w-4 h-4"
                    />
                    <span className="font-normal text-xs">Purchase Bonuses</span>
                </button>

                <button
                    type="button"
                    className="rounded flex fw-semibold py-2 px-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]"
                    onClick={() => handleBuyStarsAction()} // Open the drawer on click
                >
                    <img
                        src="/images/home/star.png"
                        alt="coin"
                        className="object-cover w-4 h-4"
                    />
                    <span className="font-normal text-xs">Purchase Stars</span>
                </button>
            </div>
            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Leverage</span>
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
                    <span className="fw-bold text-lg">Friends </span>
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

            {openBonusDrawer && bonusDef.length > 0 && (
                <DetailBonus
                    open={openBonusDrawer}
                    // bonusData={bonusData}  
                    onOpenChange={setOpenBonusDrawer}
                    onBuySuccess={updateBonusData}
                />
            )}

            {openStarDrawer && starPackages.length > 0 && (
                <DetailStar
                    open={openStarDrawer}
                    onOpenChange={setOpenStarDrawer}
                />
            )}
        </div>
    );
}
