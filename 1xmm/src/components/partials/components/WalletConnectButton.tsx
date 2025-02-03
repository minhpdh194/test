import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAccount, useConnect } from "wagmi";

const WalletConnectButton = () => {
    const { connectors, connect } = useConnect();
    const { isConnected } = useAccount();
    // const { disconnect } = useDisconnect();
    const [walletLoading, setWalletLoading] = useState(false);
    // const chainId = useChainId();
    const [walletConnected, setWalletConnected] = useState(false);

    const handleConnect = async (connector: any) => {
        setWalletLoading(true);
        connect({ connector });
        setWalletLoading(false);
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
                <Button
                    onClick={handleDisconnect}
                    disabled={walletLoading}
                >
                    Remove Wallet
                </Button>
            ) : !walletConnected && isConnected ? (
                <Button
                    onClick={registerWalletAddress}
                    disabled={walletLoading}
                >
                    Register Wallet
                </Button>
            ) : (
                <div className="flex gap-2">
                    {uniqueConnectors.map((connector) => (
                        <div className="w-full" key={connector.id}>
                            <Button
                                onClick={() => {
                                    handleConnect(connector);
                                }}
                                className="w-full"
                                disabled={walletLoading}
                                color="warning"
                            >
                                Connect
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default WalletConnectButton;
