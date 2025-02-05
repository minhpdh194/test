import { useEffect, useState } from "react";
import Header from "../components/Header";
import { bonusDefinitions } from "@/referential/bonusDefinitions";
import { BonusDefinition } from "@/types/BonusDefinition";
import { BonusTerms, BonusTypes } from "@/enums";
// import DetailStar from "@/components/partials/components/Star/DetailStar";
import ProgressBar from "@/components/ui/progress-bar";
import Star from "@/components/icons/BonusIcon/Star";
import Present from "@/components/icons/BonusIcon/Present";
import Purchased from "@/components/icons/BonusIcon/Purchased";
import { toast } from "react-toastify";
import pusher from "@/lib/pusher";
import { $http } from "@/lib/http";

export default function Bonus() {
    const [leverageData, setLeverageData] = useState<BonusDefinition[]>([]);
    const [positiveLeverageData, setPositiveLeverageData] = useState<BonusDefinition[]>([]);
    const [capitalProtectionData, setCapitalProtectionData] = useState<BonusDefinition[]>([]);
    const [timeReductionData, setTimeReductionData] = useState<BonusDefinition[]>([]);
    const [tokenData, setTokenData] = useState<BonusDefinition[]>([]);
    // const [openStarDrawer, setOpenStarDrawer] = useState(false);

    const bonusDefinitionIds = userProfile.positionStore?.available_bonuses.map(item => item.bonus_definition.id);

    useEffect(() => {
        // setInterval(async () => {
        //     const total_stars = await COMM.getStarsTarget($http);
        //     setStarsTarget(total_stars);
        // }, 2500);
        const totalCoins = pusher.subscribe("totalCoins");

        totalCoins.bind("data", (data: any) => {
            globalThis.coinTarget = data.totalCoins;
        });

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
                setTokenData(telegramResponse.filter((item: BonusDefinition) => item.bonus_type === BonusTypes.Token));
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
                <>{bonus.benefit}%</>
            );
            case BonusTypes.PositiveLeverage: return (
                <>+{bonus.benefit}x</>
            );
            case BonusTypes.TimeReduction: return (
                <>+{bonus.benefit}sec</>
            );
            case BonusTypes.Token: return (
                <>+{bonus.benefit} token</>
            )
        }
    }

    const renderBonusItem = (bonus: BonusDefinition) => {
        return (
            <div
                key={bonus.id}
                className={`flex-shrink-0 w-44 bg-[#32363C] rounded-xl p-2.5 mt-3 ${!bonusDefinitionIds?.includes(bonus.id) && 'hover:cursor-pointer'}`}
                onClick={() => handleBuyBonusAction(bonus)}
            >
                <span className="flex items-center">
                    {bonus.bonus_type != BonusTypes.Token &&
                        <div className="bg-white rounded-full min-w-10 min-h-10 mr-4">
                            {getBonusDuration(bonus.duration)}
                        </div>
                    }
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

    const handleBuyBonusAction = async (bonus: BonusDefinition) => {
        // if (globalThis.userProfile.number_of_stars > bonus.cost) {
        //     await globalThis.userProfile.BuyBonus(bonus);
        // } else {
        //     toast.warning(`You dont have enough stars to buy this bonus`);
        // }
        try {
            // Call the backend to send the invoice via Telegram bot
            const response = await $http.post("send-invoice", {
                telegram_user_id: userProfile.telegram_user_id,
                bonus: bonus
            });
            // const response = await $http.post(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_API_TOKEN}/createInvoiceLink`, {
            //     title: `Package with ${bonus.cost}`,
            //     description: 'Good package',
            //     payload: `${new Date()}_${userProfile.telegram_user_id}`,
            //     provider_token: "",
            //     currency: "XTR",
            //     prices: [
            //         {
            //             label: `Buy with ${bonus.cost} stars`,
            //             amount: bonus.cost
            //         }
            //     ]
            // });
            
            console.log('Payment invoice sent:', response);
            console.log(response.data.ok);
            if (response.data.ok) {
                console.log(window.Telegram.WebApp.version);
                if (Number(window.Telegram.WebApp.version) < 6.1) {
                    toast.error("Please update your Telegram app to the latest version to access all features.");
                } else {
                    window.Telegram.WebApp.openInvoice(response.data.result, async (status) => {
                        if (status === "paid") {
                            if (bonus.bonus_type === BonusTypes.Token) {
                                await globalThis.userProfile.BuyToken(bonus);
                            } else {
                                await globalThis.userProfile.BuyBonus(bonus);
                            }
                        } else {
                            toast.warning(`You dont have enough stars to buy this bonus`);
                        }
                    });
                }
            } else {
                toast.warning("This bonus has been purchased");
            }
        } catch (error) {
            console.error('Error sending payment invoice:', error);
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
                    <ProgressBar completed={globalThis.coinTarget / 2_000_000} />
                </div>
                <div className="flex justify-between">
                    <div className="font-bold text-sm">
                        {globalThis.coinTarget}
                    </div>
                    <div className="font-bold text-sm">
                        2,000,000
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
                    onClick={() => handleBuyStarsAction()} // Open the drawer on click
                >
                    <img
                        src="/images/home/star.png"
                        alt="coin"
                        className="object-cover w-4 h-4"
                    />
                    <span className="font-normal text-xs">Purchase Stars</span>
                </button> */}
            </div>
            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">Leverage</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">Increase your perf.</span>: each +1x leverage increases your performance by 100%.
                            Be careful, leverage applies for positive <span className="fw-bold">and negative</span> performance.
                        </span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {leverageData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {leverageData.filter(b => b.duration == BonusTerms.Short).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {leverageData.filter(b => b.duration == BonusTerms.Long).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">Positive Leverage</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">Increase your profit</span>: each +1x positive leverage increases your positive
                            performance by 100%. Losses are not impacted by positive leverage.</span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {positiveLeverageData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {positiveLeverageData.filter(b => b.duration == BonusTerms.Short).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {positiveLeverageData.filter(b => b.duration == BonusTerms.Long).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">Capital Protection</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">Protect your position</span>: each 1% of Capital Protection protects 1% of your position.</span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {capitalProtectionData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {capitalProtectionData.filter(b => b.duration == BonusTerms.Short).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {capitalProtectionData.filter(b => b.duration == BonusTerms.Long).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">Data not found</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">Time Reduction</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">Reduce your penalty</span>: each 1s bonus helps to reduce / close your position 1s earlier.</span>
                    </div>
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

            <div className="mt-4 mb-16">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">Token Package</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">Top up your balance</span>: get some tokens to refill your balance or increase your PnL.</span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {tokenData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {tokenData.slice(0, Math.ceil(tokenData.length / 2)).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {tokenData.slice(Math.ceil(tokenData.length / 2)).map(renderBonusItem)}
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

            {/* {openStarDrawer && starPackage.length > 0 && (
                <DetailStar
                    open={openStarDrawer}
                    onOpenChange={setOpenStarDrawer}
                />
            )} */}
        </div>
    );
}
