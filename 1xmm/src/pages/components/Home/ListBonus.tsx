import React from 'react';
import Drawer from "../../../components/ui/drawer";
import '../../../bonus.css'; // Import CSS for custom styles

interface DetailBonusProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bonusData: any[];  // Add bonusData prop to receive available bonuses
    onSelectBonuses: (selectedBonuses: any[]) => void;  // New prop for sending selected bonuses back
}

export default function ListBonus({
    open,
    onOpenChange,
    bonusData,
    onSelectBonuses,
    ...props
}: DetailBonusProps) {

    const [selectedBonuses, setSelectedBonuses] = React.useState<any[]>([]);

    const handleCheckboxChange = (bonusId: number) => {
        const updatedSelected = selectedBonuses.includes(bonusId)
            ? selectedBonuses.filter(id => id !== bonusId)
            : [...selectedBonuses, bonusId];

        setSelectedBonuses(updatedSelected);

        // Send selected bonuses back to parent with their full details
        const selectedBonusObjects = updatedSelected.map(id => {
            const bonus = bonusData.find(bonus => bonus.id === id);
            return bonus ? { id: bonus.id, duration: bonus.duration, bonus_type:bonus.bonus_type, benefit:bonus.benefit, cost:bonus.cost } : null; // Include id and duration
        });

        // Ensure only valid bonuses are sent
        onSelectBonuses(selectedBonusObjects.filter(bonus => bonus !== null));
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} {...props}>
            <h2 className="text-xl font-medium uppercase p-2 text-center">
                Select Bonuses
            </h2>
            <div className="flex flex-col justify-start pb-6 h-[calc(100vh-200px)] overflow-y-auto">
                {bonusData.map((bonus) => (
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
                                <span className="text-xl">{bonus.bonus_type || 'N/A'}</span>
                                <span className="text-xs flex space-x-1 items-center mt-1">
                                    <img src="/images/home/triangle.png" alt="coin" className="h-3" />
                                    <span>{bonus.cost || '0'}%</span>
                                </span>
                            </div>
                            <div className="text-sm mt-1 text-gray-400">
                                Duration: {bonus.duration || 'N/A'}
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            className={`checkbox-custom ${selectedBonuses.includes(bonus.id) ? 'checked' : ''}`}
                            onChange={() => handleCheckboxChange(bonus.id)}
                        />
                    </div>
                ))}
            </div>
        </Drawer>
    );
}
