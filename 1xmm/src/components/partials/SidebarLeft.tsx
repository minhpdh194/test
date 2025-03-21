import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import AirDrop from "../AirDrop";
import { useTonConnectUI } from "@tonconnect/ui-react";
import WalletConnector from "../WalletConnector";
import LanguageSelection from "../LanguageSelection";
import { useTranslation } from "react-i18next";
import { menu } from "@/referential/i18nPrefixes";

interface SidebarProps {
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
    const [tonConnectUI] = useTonConnectUI();
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [openAirDropDrawer, setOpenAirDropDrawer] = useState(false);
    const [openWalletConnectorDrawer, setOpenWalletConnectorDrawer] = useState(false);
    const [openLanguageSelection, setOpenLanguageSelection] = useState(false);

    const { t } = useTranslation();

    const handleOpenTelegramChannel = () => {
        window.Telegram.WebApp.openTelegramLink("https://t.me/onexmm_official")
    }

    const handleSendAirDrop = () => {
        setOpenAirDropDrawer(false);
    }

    const handleTonAction = async () => {
        if (tonConnectUI.connected) {
            handleDisConnectWallet();
        } else {
            await tonConnectUI.openModal();
        }
    };

    // Handle wallet connection
    const handleConnectWallet = useCallback((address: string) => {
        setIsConnected(true);
        console.log("Wallet connected", address);
    }, []);

    // Handle wallet disconnection
    const handleDisConnectWallet = useCallback(() => {
        setIsConnected(false);
        tonConnectUI.disconnect();
        console.log("Wallet disconnected");
    }, []);

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

    return (
        <div className="fixed inset-0 bg-[#064C7D] bg-opacity-50 z-20">
            <div
                className="fixed top-0 left-0 w-100 h-full bg-center bg-cover bg-[#064C7D] text-white z-30 p-3 transition-transform transform translate-x-0"
                style={{
                    backgroundImage: `url(/images/home/bg.png)`,
                }}
            >
                <button type="button" className="flex items-center fw-bold space-x-2" onClick={toggleSidebar}>
                    <img src="/images/home/back.png" alt="back" className="w-10 h-10" />
                    <span>{t(`${menu}.menu`)}</span>
                </button>

                <div className="w-100 bg-[#32363C] rounded-xl mt-4">
                    <Link className="row w-100 p-3 select-none hover:text-white" to="/profile">
                        <div className="col-3 flex justify-center px-0">
                            <img
                                src={`/images/avatars/avatar__${userProfile.avatar_id + 1}__.jpg`}
                                alt="avatar"
                                className="w-14 h-14 rounded-full"
                            />
                        </div>
                        <div className="col-8 pl-0">
                            <p className="text-sm font-bold">
                                {userProfile?.first_name} {userProfile?.last_name}
                            </p>
                            <p className="text-xs font-medium flex items-center mt-3 space-x-1">
                                <img src="/images/home/trophy.png" alt="trophy" className="w-4 h-4" />
                                <span>{t(`${menu}.level`)} {userProfile?.level}</span>
                                &nbsp;&nbsp;&nbsp;
                                <img src="/images/home/play.png" alt="play" className="w-3 h-4" />
                            </p>
                        </div>
                    </Link>
                </div>

                <span className="flex justify-between align-center mt-4" onClick={() => setOpenLanguageSelection(true)}>
                    <span className="cursor-pointer">{t(`${menu}.language`)}</span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </span>

                <a target="blank" href="https://one-xmm.com" className="flex hover:text-white select-none justify-between align-center mt-3">
                    <span className="cursor-pointer">{t(`${menu}.website`)}</span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </a>

                <span className="flex justify-between align-center mt-3" onClick={() => setOpenAirDropDrawer(true)}>
                    <span className="cursor-pointer">{t(`${menu}.airdrop`)}</span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </span>

                <span className="flex justify-between align-center mt-3" onClick={handleOpenTelegramChannel}>
                    <span className="cursor-pointer">{t(`${menu}.telegram_channel`)}</span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </span>

                <a target="blank" href="https://asagaia.gitbook.io/documentation/1xmm-project/mini-game" className="flex hover:text-white select-none justify-between align-center mt-3">
                    <span className="cursor-pointer">{t(`${menu}.user_manual`)}</span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </a>

                <span className="flex justify-between align-center mt-3" onClick={() => setOpenWalletConnectorDrawer(true)}>
                    <span className="cursor-pointer">{t(`${menu}.connect_wallet`)}</span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </span>

                <span className="flex justify-between align-center mt-3" onClick={handleTonAction}>
                    <span className="cursor-pointer">
                        {isConnected ? t("menu.disconnect_ton_wallet") : t("menu.connect_ton_wallet")}
                    </span>
                    <img src="/images/home/angle-right.png" alt="arrow" className="w-3 h-6" />
                </span>

                {/* <WalletConnector /> */}
                <AirDrop
                    open={openAirDropDrawer}
                    onSendAirDrop={handleSendAirDrop}
                    onOpenChange={setOpenAirDropDrawer}
                />

                <WalletConnector
                    open={openWalletConnectorDrawer}
                    onOpenChange={setOpenWalletConnectorDrawer}
                />

                <WalletConnector
                    open={openWalletConnectorDrawer}
                    onOpenChange={setOpenWalletConnectorDrawer}
                />

                <LanguageSelection
                    open={openLanguageSelection}
                    onOpenChange={setOpenLanguageSelection}
                />
            </div>
        </div>
    );
};

export default Sidebar;

