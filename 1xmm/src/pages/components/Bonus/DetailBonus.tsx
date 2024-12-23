import Drawer from "../../../components/ui/drawer";
import { toast } from 'react-toastify';
import { $http } from "@/lib/http";

import { bonusDefinitions } from "@/referential/bonusDefinitions";
import { BonusTypes } from "@/enums";
import { Utils } from "@/lib/utils";
import { BonusDefinition } from "@/types/BonusDefinition";

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBuySuccess: any;
}

export default function DetailBonus({
    open,
    onOpenChange,
    onBuySuccess,
    ...props
}: DetailBonusProps) {
    const handleBuyClick = async (bonus: BonusDefinition) => {
        // const isPurchased = bonusData.some((bonus: any) => bonus.id === id);

        // if (isPurchased) {
        //     toast.info("You have already buy this bonus!");  
        //     return;
        // }

        try {
            const response = await $http.post('/clicker/buy-bonus', { bonus: bonus });
            if (response.status === 200) {
                toast.success('Bonus bought successfully!');

                const purchasedBonus = bonus;
                if (purchasedBonus) {
                    onBuySuccess(purchasedBonus);
                }

                const telegramResponse = await $http.get("/user_bonuses");
                onBuySuccess(telegramResponse.data);
            } else if (response.status === 202) {
                console.log(response);
                toast.warning(response.data.success);
            }
            else {
                toast.error('Failed to buy bonus!');
            }
        } catch (error) {
            toast.error('An error occurred while buying the bonus!');
        }
    };
    
    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]">
                List of Bonuses
            </h2>
            <div className="flex flex-col justify-start pb-6 h-[calc(100vh-200px)] overflow-y-auto">
                {bonusDefinitions.map((bonus) => (
                    <div key={bonus.id} className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <div className="flex flex-col mt-1 max-w-[50px]">
                            <span className="text-sm">{Utils.formatString(BonusTypes[bonus.bonus_type]) || 'N/A'}</span>
                            <span className="text-sm flex space-x-1 items-center">
                                <img src="/images/home/coin.png" alt="coin" className="object-cover w-4 h-4" />
                                <span>{bonus.cost}</span>
                            </span>
                        </div>
                        <div className="flex flex-col mt-1 ml-4">
                            <span className="text-sm">{(bonus.duration / 3600).toFixed(2)} hours</span>
                            <span className="text-sm">{bonus.benefit}%</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-1 mb-1 hover:bg-blue-600"
                                onClick={() => handleBuyClick(bonus)}
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
