import Drawer from '@/components/ui/drawer';
import { StarPackage } from '@/types/StarPackage';
import { useState } from 'react';
import WalletList from '@/pages/components/Wallet/WalletList';

interface DetailStarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DetailStar({
    open,
    onOpenChange,
    ...props
}: DetailStarProps) {
    const [openWalletUI, setOpenWalletUI] = useState(false);
    const [selectedStarPackage, setSelectedStarPackage] = useState<StarPackage | undefined>();

    const handleOpenWalletList = (starPackage: StarPackage) => {
        setOpenWalletUI(true);
        setSelectedStarPackage(starPackage);
                }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]">
                List of Star Packages
            </h2>
            <div className="flex flex-col justify-start pb-6 overflow-y-auto">
                {starPackage.map((starPackage) => (
                    <div key={starPackage.id} className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                        <div className="flex flex-col mt-1">
                            <span className="text-sm">{starPackage.number_of_stars || 'N/A'} stars</span>
                            <span className="text-sm">{starPackage.discount || 0}% discounted</span>
                        </div>
                        <div className="flex flex-col mt-1 ml-4">
                            <span className="text-sm">{starPackage.cost || 0} TON/USD</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-1 mb-1 hover:bg-blue-600"
                                onClick={() => handleOpenWalletList(starPackage)}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {openWalletUI && (
                <WalletList
                    open={openWalletUI}
                    onOpenChange={setOpenWalletUI}
                    selectedStarPackage={selectedStarPackage}
                />
            )}
        </Drawer>
    );
}
