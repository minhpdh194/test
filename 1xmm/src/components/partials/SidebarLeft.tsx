import { Link } from "react-router-dom";
import { useState } from "react";
import AirDrop from "../AirDrop";

interface SidebarProps {
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
    const [openBonusDrawer, setOpenBonusDrawer] = useState(false);

    const handleOpenTelegramChannel = () => {
        window.Telegram.WebApp.openTelegramLink("https://t.me/onexmm_official")
    }

    // const connectEvmWallet = async () => {
    //     try {
    //         const web3Modal = new Web3Modal();
    //         const instance = await web3Modal.connect();
    //         const provider = new ethers.providers.Web3Provider(instance);
    //         const signer = provider.getSigner();
    //         const address = await signer.getAddress();
    //         console.log("Connected EVM Wallet Address:", address);
    //         return { provider, address };
    //     } catch (error) {
    //         console.error("Error connecting EVM wallet:", error);
    //     }
    // };

    // const connectSolanaWallet = async () => {
    //     try {
    //         if ("solana" in window) {
    //             const provider = window.solana;
    //             if (provider.isPhantom) {
    //                 const response = await provider.connect();
    //                 console.log("Connected Solana Wallet Address:", response.publicKey.toString());
    //                 return { provider, address: response.publicKey.toString() };
    //             }
    //         } else {
    //             alert("Solana wallet not found! Install Phantom Wallet.");
    //         }
    //     } catch (error) {
    //         console.error("Error connecting Solana wallet:", error);
    //     }
    // };

    // const switchEvmNetwork = async (networkKey) => {
    //     const network = NETWORKS[networkKey];
    //     if (!network) return console.error("Unsupported network");

    //     try {
    //         await window.ethereum.request({
    //             method: "wallet_switchEthereumChain",
    //             params: [{ chainId: network.chainId }],
    //         });
    //     } catch (error) {
    //         console.error("Error switching network:", error);
    //     }
    // };

    // const WalletConnector = () => {
    //     const [wallet, setWallet] = useState(null);

    //     const handleConnect = async (network) => {
    //         if (network === "solana") {
    //             const solanaWallet = await connectSolanaWallet();
    //             setWallet(solanaWallet);
    //         } else {
    //             const evmWallet = await connectEvmWallet();
    //             setWallet(evmWallet);
    //             await switchEvmNetwork(network);
    //         }
    //     };

    //     return (
    //         <div className="flex flex-col">
    //             <button onClick={() => handleConnect("ethereum")}>Connect MetaMask (Ethereum)</button>
    //             <button onClick={() => handleConnect("bsc")}>Connect BSC</button>
    //             <button onClick={() => handleConnect("polygon")}>Connect Polygon</button>
    //             <button onClick={() => handleConnect("arbitrum")}>Connect Arbitrum</button>
    //             <button onClick={() => handleConnect("solana")}>Connect Phantom (Solana)</button>
    //             {wallet && <p>Connected Wallet: {wallet.address}</p>}
    //         </div>
    //     );
    // };

    // const NETWORKS = {
    //     ethereum: { chainId: "0x1", rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_ID" },
    //     bsc: { chainId: "0x38", rpcUrl: "https://bsc-dataseed.binance.org/" },
    //     polygon: { chainId: "0x89", rpcUrl: "https://polygon-rpc.com/" },
    //     arbitrum: { chainId: "0xa4b1", rpcUrl: "https://arb1.arbitrum.io/rpc" },
    //     solana: { cluster: clusterApiUrl("mainnet-beta") },
    // };

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
                <span className="flex justify-between align-center mt-3" onClick={() => setOpenBonusDrawer(true)}>
                    <span className="cursor-pointer">Airdrop</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
                <span className="flex justify-between align-center mt-3" onClick={handleOpenTelegramChannel}>
                    <span className="cursor-pointer">Telegram Channel</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
                <a target="blank" href="https://www.one-xmm.com/news/1" className="flex hover:text-white select-none justify-between align-center mt-3">
                    <span className="cursor-pointer">User Manual</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </a>
                {/* <WalletConnector /> */}
                <AirDrop
                    open={openBonusDrawer}
                    onOpenChange={setOpenBonusDrawer}
                />
            </div>
        </div>
    );
};

export default Sidebar;

