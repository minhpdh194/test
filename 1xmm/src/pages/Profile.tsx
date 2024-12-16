import Header from "../components/Header";
import { userProfileStore } from "@/store/user-store";

export default function Profile() {
    const userProfile = userProfileStore();
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
                            src="/images/home/change-profile.png"
                            alt="trophy"
                            className="w-14 h-14"
                        />
                    </div>
                    <div className="col-8 pl-0">
                        <p className="text-sm font-bold">
                            {userProfile?.first_name} {userProfile?.last_name}
                        </p>
                        <p className="text-xs font-medium flex items-center mt-3 space-x-1">
                            <img
                                src="/images/home/trophy.png"
                                alt="trophy"
                                className="w-4 h-4"
                            />
                            <span>
                                Level {userProfile.level}
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
                        <span className="text-xl fw-bold">Total 1vMM</span>
                        <div className="flex items-center justify-center mb-2 space-x-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-8 h-8"
                            />
                            <span className="fw-bold">
                                1500
                                <span className="text-xs"> 1vMM</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-48 bg-[linear-gradient(180deg,#F79841_38.34%,#F9D838_100%)] rounded-lg">
                    <div className="text-center p-1 pt-3">
                        <span className="text-xl fw-bold">Total PnL</span>
                        <div className="flex items-center justify-center mb-2 space-x-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-8 h-8"
                            />
                            <span className="fw-bold">
                                ${userProfile.trading_info.total_pnl ?? 0}
                                <span className="text-xs">
                                    ({userProfile.trading_info?.perf_from_start_date ?? 0}% perf)
                                </span>
                            </span>

                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <span className="fw-bold">Summary of Level Evolutions</span>
                <div className="w-100 bg-[#32363C] rounded-xl p-3 mt-3">
                    <div className="flex text-sm fw-bold pb-2 mb-4 justify-between items-center" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <span className="flex items-center space-x-1">
                            <img
                                src="/images/home/clock.png"
                                alt="clock"
                                className="w-6 h-6"
                            />
                            <span>Reached Level 14</span>
                        </span>
                        <span>10 days ago</span>
                    </div>
                    <div className="flex text-sm fw-bold pb-2 mb-4 justify-between items-center" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <span className="flex items-center space-x-1">
                            <img
                                src="/images/home/clock.png"
                                alt="clock"
                                className="w-6 h-6"
                            />
                            <span>Reached Level 14</span>
                        </span>
                        <span>10 days ago</span>
                    </div>
                    <div className="flex text-sm fw-bold pb-2 mb-4 justify-between items-center" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <span className="flex items-center space-x-1">
                            <img
                                src="/images/home/clock.png"
                                alt="clock"
                                className="w-6 h-6"
                            />
                            <span>Reached Level 14</span>
                        </span>
                        <span>10 days ago</span>
                    </div>
                    <div className="flex text-sm fw-bold pb-2 mb-2 justify-between items-center" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <span className="flex items-center space-x-1">
                            <img
                                src="/images/home/clock.png"
                                alt="clock"
                                className="w-6 h-6"
                            />
                            <span>Reached Level 14</span>
                        </span>
                        <span>10 days ago</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 mb-8">
                <span className="fw-bold">Summary of Level Evolutions</span>
                <div className="w-100 bg-[#32363C] rounded-xl p-3 mt-3">
                    <div className="flex border-b fw-bold pb-2 justify-between items-center">
                        <span className="flex items-center space-x-1">
                            <span>Bonus Name</span>
                            <img
                                src="/images/home/polygon.png"
                                alt="polygon"
                                className="w-3 h-2"
                            />
                            <span className="text-xs fw-light">+5%</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-6 h-6"
                            />
                            <span>1000</span>
                        </span>
                    </div>
                    <div className="flex pb-2 pt-2 justify-between items-center">
                        <span>Bonus duration</span>
                        <span className="flex text-sm space-x-1 items-center">
                            <img
                                src="/images/home/time.png"
                                alt="time"
                                className="w-4 h-4"
                            />
                            <span>00h:00m</span>
                        </span>
                    </div>
                </div>
                <div className="w-100 bg-[#706F6FB2;] rounded-xl p-3 mt-3">
                    <div className="flex border-b fw-bold pb-2 justify-between items-center">
                        <span className="flex items-center space-x-1">
                            <span>Bonus Name</span>
                            <img
                                src="/images/home/polygon.png"
                                alt="polygon"
                                className="w-3 h-2"
                            />
                            <span className="text-xs fw-light">+5%</span>
                        </span>
                        <span className="flex items-center space-x-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-6 h-6"
                            />
                            <span>1000</span>
                        </span>
                    </div>
                    <div className="flex pb-2 pt-2 justify-between items-center">
                        <span>Bonus duration</span>
                        <span className="flex text-sm space-x-1 items-center">
                            <img
                                src="/images/home/time.png"
                                alt="time"
                                className="w-4 h-4"
                            />
                            <span>00h:00m</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
