import Drawer from "../../../components/ui/drawer";
import { toast } from 'react-toastify';
import { $http } from "@/lib/http";

import { bonusDefinitions } from "@/referential/bonusDefinitions";

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBuySuccess: any;
    // bonusData: any[];  // Add bonusData prop to receive already purchased bonuses
}

export default function DetailBonus({
    open,
    onOpenChange,
    // bonusData,
    onBuySuccess,
    ...props
}: DetailBonusProps) {
    const handleBuyClick = async (bonus: any) => {
        // const isPurchased = bonusData.some((bonus: any) => bonus.id === id);

        // if (isPurchased) {
        //     toast.info("You have already buy this bonus!");  
        //     return;
        // }

        try {
            const id = bonus.id;
            const response = await $http.post('/buy-bonus', { id });
            if (response.status === 200) {
                toast.success('Bonus bought successfully!');

                // Cập nhật bonusData khi mua thành công
                const purchasedBonus = bonusDefinitions.find((bonus: any) => bonus.id === id);
                if (purchasedBonus) {
                    onBuySuccess(purchasedBonus); // Cập nhật dữ liệu bonusData trong Bonus
                }

                // Gọi lại API để lấy dữ liệu mới
                const telegramResponse = await $http.get("/telegram-bonus");
                // Cập nhật lại bonusData và các state liên quan sau khi dữ liệu được cập nhật
                onBuySuccess(telegramResponse.data); // Cập nhật lại dữ liệu
            } else if (response.status === 202) {
                toast.warning("This bonus has been purchased");
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
                            <span className="text-sm">{bonus.bonus_type || 'N/A'}</span>
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
