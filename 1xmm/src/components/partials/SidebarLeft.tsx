import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTonConnectUI } from "@tonconnect/ui-react";
import DetailStar from "./components/Star/DetailStar";
import { toast } from "react-toastify";
import { userProfileStore } from "@/store/user-store";

interface SidebarProps {
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
    const [tonConnectUI] = useTonConnectUI();
    const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
    const [, setIsLoading] = useState(true);
    const [openStarDrawer, setOpenStarDrawer] = useState(false);
    const userProfile = userProfileStore();

    // Handle wallet connection
    const handleConnectWallet = useCallback((address: string) => {
        setTonWalletAddress(address);
        console.log("Wallet connected", address);
        setIsLoading(false);
    }, []);

    // Handle wallet disconnection
    const handleDisConnectWallet = useCallback(() => {
        setTonWalletAddress(null);
        console.log("Wallet disconnected");
        setIsLoading(false);
    }, []);

    // Check wallet connection on load
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (tonConnectUI.account?.address) {
                handleConnectWallet(tonConnectUI.account?.address);
            } else {
                handleDisConnectWallet();
            }
        };

        checkWalletConnection();

        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                handleConnectWallet(wallet.account.address);
            } else {
                handleDisConnectWallet();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [tonConnectUI, handleConnectWallet, handleDisConnectWallet]);

    // Handle wallet action (connect or disconnect)
    const handleWalletAction = async () => {
        if (tonConnectUI.connected) {
            await tonConnectUI.disconnect();
        } else {
            await tonConnectUI.openModal();
        }
    };

    const handleBuyStarsAction = async () => {
        if (tonWalletAddress) {
            setOpenStarDrawer(true);
        } else {
            await tonConnectUI.openModal();
        }
    }

    return (
        <div className="fixed inset-0 bg-[#064C7D] bg-opacity-50 z-20">
            <div
                className="fixed top-0 left-0 w-100 h-full bg-center bg-cover bg-[#064C7D] text-white z-30 p-3 transition-transform transform translate-x-0"
                style={{
                    backgroundImage: `url(/images/home/bg-sidebar.png)`,
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
                {tonWalletAddress ? (
                    <div>
                        {/* <p className="cursor-pointer">
                                {formatAddress(tonWalletAddress)}</p> */}
                        <span onClick={handleWalletAction} className="flex justify-between align-center mt-3">
                            <span className="cursor-pointer">Disconnect Wallet</span>
                            <img
                                src="/images/home/angle-right.png"
                                alt="trophy"
                                className="w-3 h-6"
                            />
                        </span>
                    </div>
                ) : (
                    <div>
                        <span className="flex justify-between align-center mt-3">
                            <span className="cursor-pointer" onClick={handleWalletAction}>Connect Wallet</span>
                            <img
                                src="/images/home/angle-right.png"
                                alt="trophy"
                                className="w-3 h-6"
                            />
                        </span>
                    </div>
                )}
                <span className="flex justify-between align-center mt-3">
                    <span className="cursor-pointer">Refer & Earn</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
                <button
                    type="button"
                    className="flex justify-between align-center mt-3 w-full"
                    onClick={() => handleBuyStarsAction()} // Open the drawer on click
                >
                    <span className="cursor-pointer">Buy Stars</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </button>
            </div>

            {openStarDrawer && starPackages.length > 0 && (
                <DetailStar
                    open={openStarDrawer}
                    onOpenChange={setOpenStarDrawer}
                />
            )}
        </div>
    );
};

export default Sidebar;

