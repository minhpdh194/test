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
import { useTranslation } from "react-i18next";
import { bonus } from "@/referential/i18nPrefixes";
import { Popover } from "@mui/material";

export default function Bonus() {
    const [leverageData, setLeverageData] = useState<BonusDefinition[]>([]);
    const [positiveLeverageData, setPositiveLeverageData] = useState<BonusDefinition[]>([]);
    const [capitalProtectionData, setCapitalProtectionData] = useState<BonusDefinition[]>([]);
    const [timeReductionData, setTimeReductionData] = useState<BonusDefinition[]>([]);
    const [tokenData, setTokenData] = useState<BonusDefinition[]>([]);
    const [friendData, setFriendData] = useState<BonusDefinition[]>([]);
    const [coinSpent, setCoinSpent] = useState<number>(globalThis.coinTarget);
    const [waitForInvoice, setWaitForInvoice] = useState(false);

    const idsBonusAlreadyBought = userProfile.positionStore?.available_bonuses.map(item => item.bonus_definition.id);

    const { t } = useTranslation();

    useEffect(() => {
        const totalCoins = pusher.subscribe("totalCoins");

        totalCoins.bind("data", (data: any) => {
            globalThis.coinTarget = data.totalCoins;
            setCoinSpent(data.totalCoins);
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
                    <>{bonus.benefit}min</>
                );
            case BonusTypes.Token: return (
                <>+{bonus.benefit.toLocaleString()} tokens</>
            )
            case BonusTypes.Friends: return (
                <>+{bonus.benefit} friends</>
            )
            }
        }

    const renderBonusItem = (bonus: BonusDefinition) => {
        return (
            <div
                key={bonus.id}
                className={`flex-shrink-0 w-44 bg-[#32363C] rounded-xl p-2.5 mt-3 ${!idsBonusAlreadyBought?.includes(bonus.id) && 'hover:cursor-pointer'}`}
                onClick={() => handleBuyBonusAction(bonus)}
            >
                <span className="flex items-center">
                    {(bonus.bonus_type !== BonusTypes.Token && bonus.bonus_type !== BonusTypes.Friends) &&
                    <div className="bg-white rounded-full min-w-10 min-h-10 mr-4">
                            {getBonusDuration(bonus.duration)}
                    </div>
                    }
                    <div className="w-full">
                        <div className="flex justify-between">
                            <span className="flex gap-2"><Star /> {bonus.cost} </span>
                            {idsBonusAlreadyBought?.includes(bonus.id) && <Purchased />}
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

    const handleBuyBonusAction = (bonus: BonusDefinition) => {
        setWaitForInvoice(true);

        $http.post("send-invoice", {
            telegram_user_id: userProfile.telegram_user_id,
            bonus: bonus
        }).then(async r => {
            setWaitForInvoice(false);

            if (r.data.ok) {
                if (Number(window.Telegram.WebApp.version) < 6.1) {
                    toast.error("Please update your Telegram app to the latest version to access all features.");
                    await $http.post("not-paid", {
                        bonus_id: bonus.id
                    });
                } else {
                    window.Telegram.WebApp.openInvoice(r.data.url.result, async (status) => {
                        if (status === "paid") {
                            if (bonus.bonus_type === BonusTypes.Token) {
                                await globalThis.userProfile.BuyToken(bonus);
                            } else if (bonus.bonus_type === BonusTypes.Friends) {
                                await globalThis.userProfile.BuyFriendsBonus(bonus);
                            } else {
                                await globalThis.userProfile.BuyBonus(bonus);
                            }
                        } else if (status !== "pending") {
                            await $http.post("not-paid", {
                                bonus_id: bonus.id
                            });

                            if (status === 'failed') toast.warning(`You dont have enough stars to buy this bonus`);
                        }
                    });
                }
            } else {
                if (r.data.bought) toast.warning("This bonus has been purchased");
                if (r.data.err_invoice) toast.warning("Error sending payment invoice");
            }
        }).catch(e => {
            setWaitForInvoice(false);

            console.error('Error sending payment invoice:', e);
            toast.warning("Error sending payment invoice");
        });
    }

    const getCurrentDistr = (amt: number):string => {
        if (amt) {
            if (amt < 1) return `${amt.toFixed(2)} 1XMM earned out of 20M`;
            return `${amt.toFixed(2)} 1XMM earned out of 20M`;
        }

        return "-";
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
            <Popover open={waitForInvoice} anchorOrigin={{vertical: 'center', horizontal: 'center'}}>{t(`${bonus}.wait_invoice`)}</Popover>
            <div className="text-xl bg-[var(--silver-white-light)] mt-3">
                {t(`${bonus}.target_to_seed`)}
            </div>

            <div className="progress-bar mt-4">
                <div className="mb-1">
                    <ProgressBar completed={coinSpent / 20_000_000} />
                </div>
                <div className="flex justify-between">
                    <div className="font-bold text-sm">
                        {getCurrentDistr(coinSpent)}
                    </div>
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">{t(`${bonus}.leverage.name`)}</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">{t(`${bonus}.leverage.title`)}</span>{t(`${bonus}.leverage.description`)}
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
                            <div className="text-center text-white">{t(`${bonus}.data_not_found`)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">{t(`${bonus}.positive_leverage.name`)}</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">{t(`${bonus}.positive_leverage.title`)}</span>{t(`${bonus}.positive_leverage.description`)}</span>
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
                            <div className="text-center text-white">{t(`${bonus}.data_not_found`)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">{t(`${bonus}.capital_protection.name`)}</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">{t(`${bonus}.capital_protection.title`)}</span>
                            {t(`${bonus}.capital_protection.description`)}
                        </span>
                    </div>
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
                            <div className="text-center text-white">{t(`${bonus}.data_not_found`)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-10">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">{t(`${bonus}.time_reduction.name`)}</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">{t(`${bonus}.time_reduction.title`)}</span>{t(`${bonus}.time_reduction.description`)}</span>
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
                            <div className="text-center text-white">{t(`${bonus}.data_not_found`)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-16">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">{t(`${bonus}.token_package.name`)}</span>
                    <div className="text-center">
                        <span className="text-xs italic"><span className="fw-bold">{t(`${bonus}.token_package.title`)}</span>{t(`${bonus}.token_package.description`)}</span>
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
                            <div className="text-center text-white">{t(`${bonus}.data_not_found`)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 mb-16">
                <div className="flex flex-col justify-between items-center">
                    <span className="fw-bold text-lg">{t(`${bonus}.friend_bonus.name`)}</span>
                    <div className="text-center">
                        <span className="text-xs italic">
                            <span className="fw-bold">{t(`${bonus}.friend_bonus.title`)}</span>
                            {t(`${bonus}.friend_bonus.description`)}
                        </span>
                    </div>
                </div>
                <div className="w-full overflow-x-auto bonus-item">
                    {friendData.length > 0 ? (
                        <>
                            {/* First Row */}
                            <div className="flex space-x-4">
                                {friendData.slice(0, Math.ceil(friendData.length / 2)).map(renderBonusItem)}
                            </div>

                            {/* Second Row */}
                            <div className="flex space-x-4">
                                {friendData.slice(Math.ceil(friendData.length / 2)).map(renderBonusItem)}
                            </div>
                        </>
                    ) : (
                        <div className="w-full bg-[#32363C] rounded-xl p-3 mt-3">
                            <div className="text-center text-white">{t(`${bonus}.data_not_found`)}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
