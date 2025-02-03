import { useState } from "react";
import { useAccount, useConnect } from "wagmi";

const WalletConnectButton = () => {
    const { connectors, connect } = useConnect();
    const { isConnected } = useAccount();
    // const { disconnect } = useDisconnect();
    // const chainId = useChainId();
    const [walletConnected, setWalletConnected] = useState(false);

    const handleConnect = async (connector: any) => {
        connect({ connector });
    };

    const handleDisconnect = async () => {
        // setWalletLoading(true);
        // await $fetch({
        //     url: "/api/user/profile/wallet/disconnect",
        //     method: "POST",
        //     body: { address },
        // });
        // disconnect();
        // setWalletLoading(false);
        // setWalletConnected(false);
        setWalletConnected(false);
    };

    const registerWalletAddress = async () => {
        // const { data, error } = await $fetch({
        //     url: "/api/user/profile/wallet/connect",
        //     method: "POST",
        //     body: { address, chainId },
        // });
        // if (!error) {
        setWalletConnected(true);
        // }
    };

    const uniqueConnectors = connectors.filter(
        (connector: any) =>
            connector.name === "MetaMask" || connector.name === "walletConnect"
    );
    console.log(uniqueConnectors);
    return (
        <div>
            {walletConnected && isConnected ? (
                <span className="flex justify-between align-center mt-3" onClick={handleDisconnect}>
                    <span className="cursor-pointer">Remove Wallet</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
            ) : !walletConnected && isConnected ? (
                <span className="flex justify-between align-center mt-3" onClick={registerWalletAddress}>
                    <span className="cursor-pointer">Register Wallet</span>
                    <img
                        src="/images/home/angle-right.png"
                        alt="trophy"
                        className="w-3 h-6"
                    />
                </span>
            ) : (
                <div className="flex gap-2">
                    {uniqueConnectors.map((connector) => (
                        <span key={connector.id} className="flex justify-between align-center mt-3" onClick={() => {
                            handleConnect(connector);
                        }}>
                            <span className="cursor-pointer">Connect</span>
                            <img
                                src="/images/home/angle-right.png"
                                alt="trophy"
                                className="w-3 h-6"
                            />
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
export default WalletConnectButton;
