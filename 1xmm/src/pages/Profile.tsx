import { getAllTasks } from "@/referential/tasks";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { TaskDefinition } from "@/types/tasks/TaskDefinition";
import { Utils } from "@/lib/utils";
import { getBenefitMeasure, prettyPrint } from "./components/Home/ListBonus";
import { BonusTerms } from "@/enums";
import Star from "@/components/icons/BonusIcon/Star";
import { levelBenefits } from "@/referential/levelBenefits";
import { LevelBenefits } from "@/types/LevelBenefits";
import { Pair } from "@/types/Pair";
import { useTranslation } from "react-i18next";
import { menu, profile } from "@/referential/i18nPrefixes";
import i18next from "i18next";

export default function Profile() {
    const [completedTasks, setCompletedTasks] = useState<TaskDefinition[]>([]);
    const [levelBenefit, setLevelBenefit] = useState<LevelBenefits>();

    const { t } = useTranslation();

    const pairs = JSON.parse(localStorage.getItem("PairReferential") || "[]") as Pair[];

    useEffect(() => {
        const currentBenefits = levelBenefits.find(benefit => benefit.level === userProfile.level);
        setLevelBenefit(currentBenefits);
    }, [userProfile.level])

    useEffect(() => {
        const result = getAllTasks(i18next.language);
        const tasks = result.filter((task: any) => userProfile.completed_task_ids.includes(task.id));
        setCompletedTasks(tasks);
    }, [userProfile.completed_task_ids]);

    return (
        <div
            className="flex-1 px-3 pb-20 bg-center bg-cover"
            style={{
                backgroundColor: `#064C7D`,
                backgroundImage: `url(/images/home/bg.png)`,
            }}
        >
            <Header />
            <div className="w-100 bg-[#32363C] rounded-xl mt-4">
                <div className="row w-100 p-3">
                    <div className="col-3 flex justify-center px-0">
                        <img
                            src={`/images/avatars/avatar__${userProfile.avatar_id + 1}__.jpg`}
                            alt="trophy"
                            className="w-14 h-14 rounded-full"
                        />
                    </div>
                    <div className="col-8 pl-0">
                        <p className="text-sm font-bold">
                            {userProfile.first_name} {userProfile.last_name}
                        </p>
                        <p className="text-xs font-medium flex items-center mt-3 space-x-1">
                            <img
                                src="/images/home/trophy.png"
                                alt="trophy"
                                className="w-4 h-4"
                            />
                            <span>
                                {t(`${menu}.level`)} {userProfile.level}
                            </span>
                            &nbsp;&nbsp;&nbsp;
                            <img
                                src="/images/home/play.png"
                                alt="play"
                                className="w-3 h-4"
                            />
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-4 gap-2">
                <div className="bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] rounded-lg w-48 h-30">
                    <div className="text-center p-1 pt-3">
                        <span className="text-xl fw-bold">{t(`${profile}.total_token`)}</span>
                        <div className="flex items-center justify-center mb-2 space-x-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-8 h-8"
                            />
                            <span className="fw-bold">
                                {Math.round(userProfile.amount_of_tokens).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-48 bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] rounded-lg">
                    <div className="text-center p-1 pt-3">
                        <span className="text-xl fw-bold">{t(`${profile}.total_pnl`)}</span>
                        <div className="flex items-center justify-center mb-2 space-x-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-8 h-8"
                            />
                            <span className="fw-bold">
                                ${userProfile.trading_info.total_pnl.toFixed(2) ?? 0}
                            </span>

                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <span className="fw-bold">{t(`${profile}.level_bonuses`)}</span>
                <div className="w-100 bg-[#32363C] rounded-xl p-3 mt-3">
                    <div>{t(`${profile}.pairs_unlocked`)}:
                        <div className="grid grid-cols-3">
                            {pairs && pairs.map && pairs.filter(pair => userProfile.unlocked_pair_ids.includes(pair.id)).map((pair, index) => (
                                <div key={index}>
                                    {pair.pair_symbol}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>{t(`${profile}.cumulated_pos_leverage_bonus`)}: +{userProfile.trading_info.positive_leverage.toFixed(2)}x</div>
                    <div>{t(`${profile}.cumulated_protection_bonus`)}: +{((userProfile.trading_info.capital_protection ?? 0) * 100).toFixed(2)}%</div>
                    <div>{t(`${profile}.cumulated_time_bonus`)}: -{userProfile.trading_info.time_reduction} min</div>
                    <div>{t(`${profile}.cumulated_tapping_amount`)}: {levelBenefit?.cumulated_tapping_amount}</div>
                    <div>{t(`${profile}.gain_per_tap`)}: {levelBenefit?.total_gain_per_tap}</div>
                </div>
            </div>
            
            <div className="mt-4">
                <span className="fw-bold">{t(`${profile}.completed_tasks`)}</span>
                <div className="w-100 bg-[#32363C] rounded-xl p-3 mt-3">
                    {completedTasks && completedTasks.map && completedTasks.map((task, index) => (
                        <div className="flex justify-between" key={index} style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                            <div>
                                <div className="text-sm fw-bold justify-between items-center">
                                    {task.name}
                    </div>
                                <div className="text-sm pb-2">
                                    {task.description}
                    </div>
                    </div>

                            <div className="text-sm fw-bold mt-2">{userProfile.completed_tasks.find(completedTask => completedTask.task_id === task.id).updated_at
                                ? Utils.getTimeDifference(userProfile.completed_tasks.find(completedTask => completedTask.task_id === task.id).updated_at) : ""}</div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 mb-8">
                <span className="fw-bold">{t(`${profile}.available_bonuses`)}</span>
                {globalThis.userProfile.positionStore!.available_bonuses && globalThis.userProfile.positionStore!.available_bonuses.map && globalThis.userProfile.positionStore!.available_bonuses.map((bonus, index) => (
                    <div className="w-100 bg-[#32363C] rounded-xl p-3 mt-3" key={index}>
                    <div className="flex border-b fw-bold pb-2 justify-between items-center">
                        <span className="flex items-center space-x-1">
                                <span>{prettyPrint(bonus.bonus_definition.bonus_type)}</span>
                            <img
                                src="/images/home/polygon.png"
                                alt="polygon"
                                className="w-3 h-2"
                            />
                                <span className="text-xs fw-light">+{bonus.bonus_definition.benefit}{getBenefitMeasure(bonus.bonus_definition.bonus_type)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                                <Star /> {bonus.bonus_definition.cost}
                        </span>
                    </div>
                    <div className="flex pb-2 pt-2 justify-between items-center">
                            <span>{t(`${profile}.bonus_duration`)}</span>
                        <span className="flex text-sm space-x-1 items-center">
                            <img
                                src="/images/home/time.png"
                                alt="time"
                                className="w-4 h-4"
                            />
                                <span>{bonus.bonus_definition.duration == BonusTerms.Short ? '3h' : '6h'}</span>
                        </span>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}
