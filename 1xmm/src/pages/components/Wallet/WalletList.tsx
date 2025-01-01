import GooglePayButton from "@google-pay/button-react";
import Drawer from "../../../components/ui/drawer";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { StarPackage } from "@/types/StarPackage";
import { toast } from "react-toastify";
import { $http } from "@/lib/http";
import { useCallback, useEffect, useState } from "react";

interface WalletListProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedStarPackage: StarPackage | undefined;
    //onBuySuccess: any;
}

export default function WalletList({
    open,
    onOpenChange,
    selectedStarPackage,
    //onBuySuccess,
    ...props
}: WalletListProps) {
    const [tonConnectUI] = useTonConnectUI();
    const receiveAccountAddress = import.meta.env.VITE_RECEIVER_WALLET_ADDRESS;
    const gatewayMerchantId = import.meta.env.VITE_GATEWAY_MERCHANT_ID;
    const merchantId = import.meta.env.VITE_MERCHANT_ID;
    const [paidPrice, setPaidPrice] = useState<number>(0);
    const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        const price = selectedStarPackage!.cost - (selectedStarPackage!.cost * (selectedStarPackage!.discount / 100));
        setPaidPrice(price);
    }, [selectedStarPackage]);

    // Handle wallet connection
    const handleConnectWallet = useCallback((address: string) => {
        setTonWalletAddress(address);
        console.log("Wallet connected", address);
    }, []);

    // Handle wallet disconnection
    const handleDisConnectWallet = useCallback(() => {
        setTonWalletAddress(null);
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

    const handleTonTransaction = async (amount: number) => {
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 120, // Transaction valid for 120 seconds
            messages: [
                {
                    address: receiveAccountAddress,
                    amount: amount * 1e9 + '',
                    // Optional fields:
                    // stateInit: "base64bocblahblahblah==", // Optional state initialization
                    // payload: "base64payload==" // Optional payload data
                }
            ]
        };

        try {
            const result = await tonConnectUI.sendTransaction(transaction);
            console.log('Transaction sent successfully:', result);
            return true;
        } catch (error) {
            console.error('Failed to send transaction:', error);
            return false;
        }
    };

    const handleTonAction = async () => {
        if (tonConnectUI.connected) {
            try {
                const transactionResult = await handleTonTransaction(paidPrice);
                if (transactionResult) {
                    await handleBuyStarPackage();
                } else {
                    toast.error('Failed to buy package!');
                }
            } catch (error) {
                console.error("Error buying bonus:", error);
                toast.error('An error occurred while buying the bonus!');
            }
        } else {
            await tonConnectUI.openModal();
        }
    };

    const handleBuyStarPackage = async () => {
        try {
            const response = await $http.post('/buy-stars', { package: selectedStarPackage });
            if (response.status === 200) {
                toast.success('Package bought successfully!');
            }
            else {
                toast.error('Failed to buy package!');
            }
        } catch (error) {
            console.error("Error buying bonus:", error);
            toast.error('An error occurred while buying the bonus!');
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <div className="flex flex-col justify-start items-center gap-4 pb-6 overflow-y-auto">
                <GooglePayButton
                    environment="TEST"
                    paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                            {
                                type: 'CARD',
                                parameters: {
                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                },
                                tokenizationSpecification: {
                                    type: 'PAYMENT_GATEWAY',
                                    parameters: {
                                        gateway: 'example',
                                        gatewayMerchantId: gatewayMerchantId,
                                    },
                                },
                            },
                        ],
                        merchantInfo: {
                            merchantId: merchantId,
                            merchantName: 'Demo Merchant',
                        },
                        transactionInfo: {
                            totalPriceStatus: 'FINAL',
                            totalPriceLabel: 'Total',
                            totalPrice: `${paidPrice.toFixed(2)}`,
                            currencyCode: 'USD',
                            countryCode: 'US',
                        }
                    }}
                    onLoadPaymentData={(paymentRequest: any) => {
                        console.log('Load payment data:', paymentRequest);
                        handleBuyStarPackage();
                    }}
                    onError={(error) => {
                        console.error('Google Pay Error:', error);
                    }}
                />

                <button
                    onClick={handleTonAction}
                    className={`px-6 py-3 rounded-full text-white font-semibold text-lg shadow-md transition 
                        ${tonWalletAddress ? 'bg-green-500 cursor-default' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
                >
                    {tonWalletAddress ? 'Transaction' : 'Connect Wallet'}
                </button>
            </div>
        </Drawer>
    );
}
