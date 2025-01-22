import { Link } from "react-router-dom";

interface SidebarProps {
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
    return (
        <div className="fixed inset-0 bg-[#064C7D] bg-opacity-50 z-20">
            <div
                className="fixed top-0 left-0 w-100 h-full bg-center bg-cover bg-[#064C7D] text-white z-30 p-3 transition-transform transform translate-x-0"
                style={{
                    backgroundImage: `url(/images/home/bg.png)`,
                }}
            >
                <button type="button" className="flex items-center fw-bold space-x-2" onClick={toggleSidebar}>
                    <img
                        src="/images/home/back.png"
                        alt="trophy"
                        className="w-10 h-10"
                    />
                    <span>Menu</span>
                </button>
                <div className="w-100 bg-[#32363C] rounded-xl mt-4">
                    <Link className="row w-100 p-3 select-none hover:text-white" to="/profile">
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
                                    Level {userProfile?.level}
                                </span>
                                &nbsp;&nbsp;&nbsp;
                                <img
                                    src="/images/home/play.png"
                                    alt="play"
                                    className="w-3 h-4"
                                />
                            </p>
                        </div>
                    </Link>
                </div>
                <span className="flex justify-between align-center mt-4">
                    <span className="cursor-pointer">Language</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
                <a target="blank" href="https://one-xmm.com" className="flex hover:text-white select-none justify-between align-center mt-3">
                    <span className="cursor-pointer">Website</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </a>
                <span className="flex justify-between align-center mt-3">
                    <span className="cursor-pointer">Airdrop</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
                <span className="flex justify-between align-center mt-3">
                    <span className="cursor-pointer">Telegram Channel</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>

                <span className="flex justify-between align-center mt-3">
                    <span className="cursor-pointer">Refer & Earn</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
            </div>
        </div>
    );
};

export default Sidebar;

