import { useEffect, useState } from "react";
import Header from "../components/Header";
//import { $http } from "@/lib/http";
//import { toast } from "react-toastify";
import { bonusDefinitions } from "@/referential/bonusDefinitions";
import { BonusDefinition } from "@/types/BonusDefinition";
import { BonusTerms, BonusTypes } from "@/enums";
import DetailStar from "@/components/partials/components/Star/DetailStar";
import ProgressBar from "@/components/ui/progress-bar";
import Star from "@/components/icons/BonusIcon/Star";
import Present from "@/components/icons/BonusIcon/Present";
import Purchased from "@/components/icons/BonusIcon/Purchased";

export default function Bonus() {
    const [leverageData, setLeverageData] = useState<any[]>([]);
    const [positiveLeverageData, setPositiveLeverageData] = useState<any[]>([]);
    const [capitalProtectionData, setCapitalProtectionData] = useState<any[]>([]);
    const [timeReductionData, setTimeReductionData] = useState<any[]>([]);
    // const [friendData, setFriendData] = useState<any[]>([]);
    const [openStarDrawer, setOpenStarDrawer] = useState(false);

    const bonusDefinitionIds = userProfile.positionStore?.available_bonuses.map(item => item.bonus_definition.id);
    //const updateBonusData = async () => {
    //     try {
    //         throw new Error("Need to send update of buying purchase to server");
    //     } catch (error) {
    //         console.error("Error fetching bonus data:", error);
    //     }
    //};

    useEffect(() => {
        const fetchBonusData = async () => {
            try {
                const telegramResponse = bonusDefinitions;
                setLeverageData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.Leverage).sort((a, b) => {
                    if (a.duration === BonusTerms.Short && b.duration !== BonusTerms.Short) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Short && b.duration === BonusTerms.Short) {
                        return 1;
                    }
                    if (a.duration === BonusTerms.Long && b.duration !== BonusTerms.Long) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Long && b.duration === BonusTerms.Long) {
                        return 1;
                    }
                    return 0;
                }));
                setPositiveLeverageData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.PositiveLeverage).sort((a, b) => {
                    if (a.duration === BonusTerms.Short && b.duration !== BonusTerms.Short) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Short && b.duration === BonusTerms.Short) {
                        return 1;
                    }
                    if (a.duration === BonusTerms.Long && b.duration !== BonusTerms.Long) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Long && b.duration === BonusTerms.Long) {
                        return 1;
                    }
                    return 0;
                }));
                setCapitalProtectionData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.CapitalProtection).sort((a, b) => {
                    if (a.duration === BonusTerms.Short && b.duration !== BonusTerms.Short) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Short && b.duration === BonusTerms.Short) {
                        return 1;
                    }
                    if (a.duration === BonusTerms.Long && b.duration !== BonusTerms.Long) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Long && b.duration === BonusTerms.Long) {
                        return 1;
                    }
                    return 0;
                }));
                setTimeReductionData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.TimeReduction).sort((a, b) => {
                    if (a.duration === BonusTerms.Short && b.duration !== BonusTerms.Short) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Short && b.duration === BonusTerms.Short) {
                        return 1;
                    }
                    if (a.duration === BonusTerms.Long && b.duration !== BonusTerms.Long) {
                        return -1;
                    }
                    if (a.duration !== BonusTerms.Long && b.duration === BonusTerms.Long) {
                        return 1;
                    }
                    return 0;
                }));
                // setFriendData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.Friends));

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

    const renderBenefit = (bonus: BonusDefinition) => {
        switch (bonus.bonus_type) {
            case BonusTypes.Leverage: return (
                <>+{bonus.benefit}x</>
            );
            case BonusTypes.CapitalProtection: return (
                <>+{bonus.benefit}x</>
            );
            case BonusTypes.PositiveLeverage: return (
                <>+{bonus.benefit}x</>
            );
            case BonusTypes.TimeReduction: return (
                <>+{bonus.benefit}sec</>
            );
        }
    }

    const renderBonusItem = (bonus: BonusDefinition) => {
        return (
            <div
                key={bonus.id}
                className={`flex-shrink-0 w-[calc(45%-1rem)] bg-[#32363C] rounded-xl p-2.5 mt-3 ${!bonusDefinitionIds?.includes(bonus.id) && 'hover:cursor-pointer'}`}
                style={{ flexBasis: 'calc(45% - 1rem)' }}
                onClick={() => handleBuyBonusAction(bonus)}
            >
                <span className="flex items-center">
                    <div className="bg-white rounded-full min-w-10 min-h-10 mr-4">
                        {bonus.bonus_type != BonusTypes.Friends
                            ? getBonusDuration(bonus.duration)
                            : ''}
                    </div>
                    <div className="w-full">
                        <div className="flex justify-between">
                            <span className="flex gap-2"><Star /> {bonus.cost} </span>
                            {bonusDefinitionIds?.includes(bonus.id) && <Purchased />}
                        </div>

                        <div className="h-[1px] bg-gray-600 my-1"></div>
                        <span className="flex gap-2"><Present /> {renderBenefit(bonus)}</span>
                    </div>
                </span>
            </div>
        );
    };

    const getBonusDuration = (bonusTerm: BonusTerms) => {
        return (
            <span className="flex flex-col items-center justify-center h-10 w-10">
                <span className="text-black leading-3">{bonusTerm == BonusTerms.Short ? "3" : "6"}</span>
                <span className="text-gray-500 text-xs font-bold">HRS</span>
            </span>
        );
    }

    const handleBuyStarsAction = async () => {
        setOpenStarDrawer(true);
    }

    const handleBuyBonusAction = async (bonus: BonusDefinition) => {
        if (globalThis.userProfile.number_of_stars > 0) {
            await globalThis.userProfile.BuyBonus(bonus);
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
            <Header amount_token={userProfile.amount_of_tokens} />
            <div className="text-xl bg-[var(--silver-white-light)] mt-3">
                Target to Seed
            </div>

            <div className="progress-bar mt-4">
                <div className="mb-1">
                    <ProgressBar completed={60} />
                </div>
                <div className="flex justify-between">
                    <div className="font-bold text-sm">
                        $0
                    </div>
                    <div className="font-bold text-sm">
                        {`$600.000`}
                    </div>
                </div>
            </div>

            {/* <div className="mt-5 mb-8">
                <div className="italic text-sm">
                    Purchasing bonus entitles to receive 1XMM coins at a ratio of 0.30cts per token, as long as the total allocation amount has not been reached.
                    Check our website to see whether bonus allocated tokens are still available.
                </div>
            </div> */}
            <div className="flex justify-between mt-4 mb-6">
                {/* <button
                    type="button"
                    className="rounded flex fw-semibold py-2 px-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]"
                    onClick={() => handleBuyBonusAction()}
                >
                    <img
                        src="/images/home/star.png"
                        alt="coin"
                        className="object-cover w-4 h-4"
                    />
                    <span className="font-normal text-xs">Purchased Bonuses</span>
                </button> */}

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
                <div className="w-full overflow-x-auto bonus-item">
                    {leverageData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {leverageData.slice(0, Math.ceil(leverageData.length / 2)).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {leverageData.slice(Math.ceil(leverageData.length / 2)).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Positive Leverage</span>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {positiveLeverageData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {positiveLeverageData.slice(0, Math.ceil(positiveLeverageData.length / 2)).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {positiveLeverageData.slice(Math.ceil(positiveLeverageData.length / 2)).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Capital Protection</span>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {capitalProtectionData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {capitalProtectionData.slice(0, Math.ceil(capitalProtectionData.length / 2)).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {capitalProtectionData.slice(Math.ceil(capitalProtectionData.length / 2)).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="fw-bold text-lg">Time Reduction</span>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {timeReductionData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {timeReductionData.slice(0, Math.ceil(timeReductionData.length / 2)).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {timeReductionData.slice(Math.ceil(timeReductionData.length / 2)).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            {/* <div className="mt-4 mb-6">
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
            </div> */}

            {/* {openBonusDrawer && bonusDef.length > 0 && (
                <DetailBonus
                    open={openBonusDrawer}
                    // bonusData={bonusData}  
                    onOpenChange={setOpenBonusDrawer}
                //onBuySuccess={updateBonusData}
                />
            )} */}

            {openStarDrawer && starPackage.length > 0 && (
                <DetailStar
                    open={openStarDrawer}
                    onOpenChange={setOpenStarDrawer}
                />
            )}
        </div>
    );
}
