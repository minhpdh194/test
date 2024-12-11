import Drawer from "../../../components/ui/drawer";

interface DetailBonusProps {
    name: string;
    // baseSymbol: string;  // Add baseSymbol property
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DetailBonus({
    name,
    // baseSymbol,  // Destructure baseSymbol
    open,
    onOpenChange,
    ...props
}: DetailBonusProps) {
    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]">
                {name} / USDT  {/* Display pair_symbol and base_symbol */}
            </h2>
            <div className="pb-6">
                <div className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                    <span className="text-sm">Long</span>
                    <span className="text-sm">Long[xxxx] 1vMM</span>
                </div>
                <div className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                    <span className="text-sm">Performance to Date</span>
                    <span className="text-sm">10%</span>
                </div>
                <div className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                    <span className="text-sm">Bonuses</span>
                    <span className="text-sm flex justify-between space-x-1 items-center">
                        <img
                            src="/images/home/coin.png"
                            alt="coin"
                            className="object-cover w-4 h-4"
                        />
                        <span>500</span>
                    </span>
                </div>
            </div>
        </Drawer>
    );
}