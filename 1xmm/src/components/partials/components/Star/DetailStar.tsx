import { toast } from 'react-toastify';
import { $http } from "@/lib/http";
import Drawer from '@/components/ui/drawer';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { StarPackage } from '@/types/StarPackage';

interface DetailStarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DetailStar({
    open,
    onOpenChange,
    ...props
}: DetailStarProps) {
    const [tonConnectUI] = useTonConnectUI();
    const receiveAccountAddress = import.meta.env.VITE_RECEIVER_WALLET_ADDRESS;
    
    const buyStarPackage = async (amount: number) => {
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

    const calculatePackagePrice = (starPackage: StarPackage) => {
        return starPackage.cost - (starPackage.cost * (starPackage.discount / 100));
    }

    const handleBuyStarPackage = async (starPackage: StarPackage) => {
        try {
            const paidPrice = calculatePackagePrice(starPackage);
            const transactionResult = await buyStarPackage(paidPrice);
            if (transactionResult) {
                const response = await $http.post('/buy-stars', { package: starPackage });
                if (response.status === 200) {
                    toast.success('Bonus bought successfully!');
                }
                else {
                    toast.error('Failed to buy package!');
                }
            } else {
                toast.error('Failed to buy package!');
            }
        } catch (error) {
            console.error("Error buying bonus:", error);
            toast.error('An error occurred while buying the bonus!');
        }
    };


    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]">
                List of Star Packages
            </h2>
            <div className="flex flex-col justify-start pb-6 overflow-y-auto">
                {starPackages.map((starPackage) => (
                    <div key={starPackage.id} className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <div className="flex flex-col mt-1">
                            <span className="text-sm">{starPackage.number_of_stars || 'N/A'} stars</span>
                            <span className="text-sm">{starPackage.discount || 0}% discounted</span>
                        </div>
                        <div className="flex flex-col mt-1 ml-4">
                            <span className="text-sm">{starPackage.cost || 0} USD</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-1 mb-1 hover:bg-blue-600"
                                onClick={() => handleBuyStarPackage(starPackage)}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Drawer>
    );
}
