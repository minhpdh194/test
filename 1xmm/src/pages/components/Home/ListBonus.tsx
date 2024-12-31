import React from 'react';
import Drawer from "../../../components/ui/drawer";
import '../../../bonus.css'; // Import CSS for custom styles
import { Bonus } from '@/classes/Bonus';
import { BonusTerms, BonusTypes } from '@/enums';
import { Button } from '@/components/ui/button';

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bonusData: Bonus[];  // Add bonusData prop to receive available bonuses
    onSelectBonuses: (selectedBonuses: Bonus[]) => void;  // New prop for sending selected bonuses back
}

export default function ListBonus({
    open,
    onOpenChange,
    bonusData,
    onSelectBonuses,
    ...props
}: DetailBonusProps) {

    const [selectedBonuses, setSelectedBonuses] = React.useState<Bonus[]>([]);

    const handleCheckboxChange = (bonus: Bonus) => {
        if (selectedBonuses.includes(bonus)) return;
        const updatedSelected = [...selectedBonuses, bonus];
        setSelectedBonuses(updatedSelected);
    };

    const getBenefitMeasure = (bonusType: BonusTypes): string => {
        if (bonusType == BonusTypes.CapitalProtection) return '%';
        if (bonusType == BonusTypes.TimeReduction) return 'h';
        if (bonusType == BonusTypes.Friends) return '';
        return 'x';
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Select Bonuses
            </h2>
            <div className="flex flex-col justify-start pb-6 h-[calc(100vh-200px)] overflow-y-auto">
                {bonusData.sort((a,b) => a.id - b.id).map((bonus) => (
                    <div
                        key={bonus.id}
                        className="p-2 flex justify-between mb-2"
                        style={{
                            borderBottom: `.3px solid #FFFFFF33`,
                            borderRadius: '15px', // Rounded corners for the bonus item container
                            backgroundColor: '#252628', // Background color
                        }}
                    >
                        <div className="flex flex-col mt-1 w-full pl-2">
                            <div className="flex space-x-2 items-center">
                                <span className="text-xl">{bonus.bonus_definition.bonus_type.toString()}</span>
                                <span className="text-xs flex space-x-1 items-center mt-1">
                                    <span>+{bonus.bonus_definition.benefit}{getBenefitMeasure(bonus.bonus_definition.bonus_type)}</span>
                                </span>
                            </div>
                            <div className="text-sm mt-1 text-gray-400">
                                Duration: {bonus.bonus_definition.duration == BonusTerms.Short ? '3h' : '6h'}
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className={`checkbox-custom ${selectedBonuses.includes(bonus) ? 'checked' : ''}`}
                            onChange={() => handleCheckboxChange(bonus)}
                        />
                    </div>
                ))}
            </div>
            <div />
            <Button
                className="rounded flex w-full fw-semibold py-2 space-x-1 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)]"
                onClick={() => onSelectBonuses(selectedBonuses)}
                >
                <span className="font-normal text-lg">Add</span>
            </Button>
        </Drawer>
    );
}
