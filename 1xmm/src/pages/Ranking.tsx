import { UserRanking } from "@/types/UserRanking";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Utils } from "@/lib/utils";
// import { useUserStore } from "@/store/user-store";
import { addWeeks, startOfWeek, format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { $http } from "@/lib/http";
import { useTranslation } from "react-i18next";
import { months, ranking } from "@/referential/i18nPrefixes";

interface Payload {
    date?: string;
    week?: { start: string; end: string };
    month?: string;
}

export default function Ranking() {
    const [userRanking, setUserRanking] = useState<UserRanking[]>([]);

    const { t } = useTranslation();

    const formatNumber = (userRanking: UserRanking) => {
        if (userRanking.amount_of_tokens === 0) {
            return "-";
        } else {
        const formattedNumberOfTokens = Math.trunc(userRanking.amount_of_tokens).toLocaleString();
        return formattedNumberOfTokens;
    }
    }

    const selectedDate = new Date();
    const [selectedFilter, setSelectedFilter] = useState(-1);

    useEffect(() => {
        async function getUserRanking() {
            try {
                setUserRanking([]);
                const payload: Payload = {};

                if (selectedFilter === 1) {
                    payload.week = {
                        start: format(selectedWeek.start, "yyyy-MM-dd"),
                        end: format(selectedWeek.end, "yyyy-MM-dd"),
                    };
                } else if (selectedFilter === 2) {
                    payload.month = selectedMonth;
                } else {
                    payload.date = format(selectedDate, "yyyy-MM-dd");
                }

                const response = await $http.get('/top-users', { params: payload });

                response.data.forEach((transaction: any) => {
                    const newData = {
                        telegram_user_id: transaction.telegram_user_id,
                        first_name: transaction.user_data.first_name ? transaction.user_data.first_name : "",
                        last_name: transaction.user_data.last_name ? transaction.user_data.last_name : "",
                        amount_of_tokens: transaction.tokens,
                    };

                    setUserRanking(prevState => [...prevState, newData]);
                });
                const usersResponse = await $http.get('/get-left-users', {
                    params: {
                        played_users: response.data
                    }
                });
                usersResponse.data.forEach((userData: any) => {
                    const newData = {
                        telegram_user_id: userData.telegram_user_id,
                        first_name: userData.first_name ? userData.first_name : "",
                        last_name: userData.last_name ? userData.last_name : "",
                        amount_of_tokens: 0,
                    };

                    setUserRanking(prevState => [...prevState, newData]);
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        getUserRanking();
    }, [selectedFilter]);

    const currentWeekStart = startOfWeek(new Date());
    const currentWeekEnd = addWeeks(currentWeekStart, 1);

    const selectedWeek = {
        start: currentWeekStart,
        end: currentWeekEnd
        };

    const monthList = [
        t(`${months}.january`),
        t(`${months}.february`),
        t(`${months}.march`),
        t(`${months}.april`),
        t(`${months}.may`),
        t(`${months}.june`),
        t(`${months}.july`),
        t(`${months}.august`),
        t(`${months}.september`),
        t(`${months}.october`),
        t(`${months}.november`),
        t(`${months}.december`),
    ];

    const selectedMonth = monthList[new Date().getMonth()];

    const firstPositionUser = userRanking[0];
    const secondPositionUser = userRanking[1];
    const thirdPositionUser = userRanking[2];

    return (
        <div
            className="flex-1 px-3 pb-20 bg-center bg-cover"
            style={{
                backgroundColor: `#064C7D`,
                backgroundImage: `url(/images/home/bg.png)`,
            }}
        >
            <Header amount_token={userProfile.amount_of_tokens} />
            <div className="mt-4 mb-8">
                <div className="flex gap-2 w-100 text-sm">
                    <div className="bg-[#32363C] flex-1 text-center py-2 rounded-lg" onClick={() => setSelectedFilter(0)}>
                        <span className="text-[#F79841] fw-semibold">{t(`${ranking}.daily`)}</span>
                        <span className="fw-light block">{Utils.formatDate(selectedDate.toUTCString())}</span>
                    </div>
                    <div className="bg-[#32363C] flex-1 text-center py-2 rounded-lg" onClick={() => setSelectedFilter(1)}>
                        <span className="text-[#6F72E2] fw-semibold">{t(`${ranking}.weekly`)}</span>
                        <span className="fw-light block">{format(selectedWeek.start, 'MMM dd')} - {format(selectedWeek.end, 'MMM dd')}</span>
                    </div>
                    <div className="bg-[#32363C] flex-1 text-center py-2 rounded-lg" onClick={() => setSelectedFilter(2)}>
                        <span className="text-[#84CB69] fw-semibold">{t(`${ranking}.monthly`)}</span>
                        <span className="fw-light block">{selectedMonth}</span>
                    </div>
                </div>
                <div className="flex w-100 text-sm mt-5 items-end">
                    {secondPositionUser && (
                    <div className="bg-[#32363C] flex-1 text-center py-2 h-38" style={{ borderTopLeftRadius: `1rem`, borderBottomLeftRadius: `1rem` }}>
                        <div className="relative w-full">
                            <img
                                src="/images/ranking/top2.png"
                                alt="top2"
                                className="w-16 absolute -top-10 left-1/2 transform -translate-x-1/2"
                                style={{
                                    height: `4.5rem`,
                                }}
                            />
                        </div>
                        <div className="flex justify-center w-100 mt-3 pt-1 relative">
                            <img
                                src="/images/ranking/avatar.png"
                                alt="avatar"
                                className="w-16 p-1 h-16"
                                style={{
                                    border: `3.77px solid transparent`,
                                    background: `linear-gradient(to bottom, #6E69F7 0%, #E496E7 100%)`,
                                    borderRadius: `50%`,
                                    backgroundClip: `padding-box, border-box`,
                                    backgroundOrigin: `padding-box, border-box`,
                                }}
                            />
                            <img
                                src="/images/ranking/bg-top2.png"
                                alt="avatar"
                                className="w-5 h-5 absolute bottom-[-5px] left-1/2 transform -translate-x-1/2"
                            />
                            <span className="fw-bold text-xs absolute bottom-[-5px] left-1/2 transform -translate-x-1/2">
                                2
                            </span>
                        </div>
                            {/* <span className="fw-light text-xs block pt-2">{calculatePercentile(secondPositionUser)}%</span> */}
                        <span className="block fw-bold">{secondPositionUser.first_name + " " + secondPositionUser.last_name}</span>
                        <span className="flex fw-bold items-center justify-center">
                                {secondPositionUser.amount_of_tokens !== 0 && (
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-4 h-4"
                            />
                                )}

                            {formatNumber(secondPositionUser)}
                        </span>
                    </div>
                    )}

                    {firstPositionUser && (
                    <div className="bg-[#2E3034] flex-1 text-center py-2 h-56 relative" style={{ borderTopRightRadius: `2rem`, borderTopLeftRadius: `2rem` }}>
                        <div className="relative w-full">
                            <img
                                src="/images/ranking/top1.png"
                                alt="top1"
                                className="w-16 absolute -top-10 left-1/2 transform -translate-x-1/2"
                                style={{
                                    height: `4.5rem`,
                                }}
                            />
                        </div>
                        <div className="flex justify-center w-100 mt-4 pt-1">
                            <img
                                src="/images/ranking/avatar.png"
                                alt="avatar"
                                className="w-20 p-1 h-20"
                                style={{
                                    border: `3.77px solid transparent`,
                                    background: `linear-gradient(to bottom, #6E69F7 0%, #E496E7 100%)`,
                                    borderRadius: `50%`,
                                    backgroundClip: `padding-box, border-box`,
                                    backgroundOrigin: `padding-box, border-box`,
                                }}
                            />
                            <img
                                src="/images/ranking/bg-top1.png"
                                alt="avatar"
                                className="w-5 h-5 absolute"
                                style={{
                                    top: `45%`
                                }}
                            />
                            <span className="fw-bold text-xs absolute" style={{
                                top: `46%`,
                            }}>1</span>
                        </div>
                        <span className="block fw-bold mt-3">{firstPositionUser.first_name + " " + firstPositionUser.last_name}</span>
                            {/* <span className="fw-light text-xs block">{calculatePercentile(firstPositionUser)}%</span> */}
                        <span className="flex text-lg fw-bold items-center justify-center mt-1">
                                {firstPositionUser.amount_of_tokens !== 0 && (
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                        className="w-4 h-4"
                            />
                                )}

                            {formatNumber(firstPositionUser)}
                        </span>
                    </div>
                    )}

                    {thirdPositionUser && (<div className="bg-[#32363C] flex-1 text-center py-2 h-38" style={{ borderTopRightRadius: `1rem`, borderBottomRightRadius: `1rem` }}>
                        <div className="relative w-full">
                            <img
                                src="/images/ranking/top3.png"
                                alt="top3"
                                className="w-16 absolute -top-10 left-1/2 transform -translate-x-1/2"
                                style={{
                                    height: `4.5rem`,
                                }}
                            />
                        </div>
                        <div className="flex justify-center w-100 mt-3 pt-1 relative">
                            <img
                                src="/images/ranking/avatar.png"
                                alt="avatar"
                                className="w-16 p-1 h-16"
                                style={{
                                    border: `3.77px solid transparent`,
                                    background: `linear-gradient(to bottom, #6E69F7 0%, #E496E7 100%)`,
                                    borderRadius: `50%`,
                                    backgroundClip: `padding-box, border-box`,
                                    backgroundOrigin: `padding-box, border-box`,
                                }}
                            />
                            <img
                                src="/images/ranking/bg-top3.png"
                                alt="avatar"
                                className="w-5 h-5 absolute bottom-[-5px] left-1/2 transform -translate-x-1/2"
                            />

                            <span className="fw-bold text-xs absolute bottom-[-5px] left-1/2 transform -translate-x-1/2">
                                3
                            </span>
                        </div>

                        {/* <span className="fw-light text-xs block pt-2">{calculatePercentile(thirdPositionUser)}%</span> */}
                        <span className="block fw-bold">{thirdPositionUser.first_name + " " + thirdPositionUser.last_name}</span>
                        <span className="flex fw-bold items-center justify-center">
                            {thirdPositionUser.amount_of_tokens !== 0 && (
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-4 h-4"
                            />
                            )}
                            {formatNumber(thirdPositionUser)}
                        </span>
                    </div>
                    )}
                </div>
                {userRanking.length > 3 && userRanking.slice(3) && userRanking.slice(3).map((user, index) => {
                    return (
                        <div className="w-100 text-sm p-3" key={index}>
                    <div className="row p-2 rounded-xl items-center bg-[#19203b]">
                        <div className="col-2 flex justify-center items-center p-0">
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                    minWidth: '23px',
                                    minHeight: '23px',
                                    display: 'inline-flex',
                                }}
                            >
                                        {index + 4}
                            </span>
                        </div>

                        <div className="col-2 flex justify-center items-center p-0">
                            <img
                                src="/images/ranking/avatar.png"
                                alt="avatar"
                                className="p-1 w-100"
                            />
                        </div>
                        <div className="col-5">
                                    <span className="fw-bold block">{user.first_name + " " + user.last_name}</span>
                                    <span className="fw-light block text-xs">{formatNumber(user)} {user.amount_of_tokens !== 0 && t("ranking.points")}</span>
                        </div>
                                {/* {user.current_amount_of_tokens >= user.last_amount_of_tokens ? (
                        <div className="col-3 flex items-center justify-end">
                            <img
                                src="/images/home/polygon.png"
                                alt="avatar"
                                className="h-3 w-3"
                            /> &nbsp;
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: `2px solid #fff`,
                                    minWidth: `30px`,
                                    minHeight: `30px`,
                                    display: `inline-flex`,
                                    fontSize: `10px`
                                }}
                            >
                                            +{calculatePercentile(user)}%
                            </span>
                        </div>
                                ) : (
                        <div className="col-3 flex items-center justify-end">
                            <img
                                src="/images/home/down-red.png"
                                alt="avatar"
                                className="h-3 w-3"
                            /> &nbsp;
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: `2px solid #fff`,
                                    minWidth: `30px`,
                                    minHeight: `30px`,
                                    display: `inline-flex`,
                                    fontSize: `10px`
                                }}
                            >
                                            -{calculatePercentile(user)}%
                            </span>
                        </div>
                                    )} */}
                    </div>
                </div>
                    )
                })}
            </div>

            {/* <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {selectedFilter === 0 && (
                    <Calendar date={selectedDate} onChange={handleSelectDate} />
                )}
                {selectedFilter === 1 && (
                    <Select
                        value={selectedWeek ? `${selectedWeek.start}-${selectedWeek.end}` : ''}
                        onChange={(event) => {
                            const [start, end] = event.target.value.split('-');
                            setSelectedWeek({ start: new Date(start), end: new Date(end) });
                        }}
                    >
                        {weeks.map((week, index) => (
                            <MenuItem key={index} value={`${week.start}-${week.end}`}>
                                {format(week.start, 'MMM dd')} - {format(week.end, 'MMM dd')}
                            </MenuItem>
                        ))}
                    </Select>
                )}
                {selectedFilter === 2 && (
                    <Select
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(event.target.value)}
                    >
                        {months.map((month, index) => (
                            <MenuItem key={index} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </Popover> */}
        </div>
    );
}
