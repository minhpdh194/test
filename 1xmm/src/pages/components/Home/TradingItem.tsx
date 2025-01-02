import { useEffect, useState } from 'react';
import CounterInput from './CounterInput';
import NumberFormat from "./NumberFormat";
import { Position } from '@/classes/Position';
import { toast } from "react-toastify";
import { LongShort } from '@/enums';
import ListBonus from "./ListBonus";
import { Utils } from '@/lib/utils';
import { SpotType } from '@/types/SpotType';
import { Pair } from '@/types/Pair';
import { Bonus } from '@/classes/Bonus';
import { DateCountDown } from '@/classes/CountDown';

type TradingItemProps = {
    spots: SpotType[];
    onValidatePosition: (amount: number) => void;
};

const TradingItem = ({ spots, onValidatePosition }: TradingItemProps) => {
    // const [, setTimeBonus] = useState(null);
    //const [bonusData, setBonusData] = useState<any[]>([]);
    const pairs = JSON.parse(localStorage.getItem("PairReferential") || "[]") as Pair[];

    const [selectedBonuses, setBonusesForPosition] = useState<{ [key: number]: { bonus: Bonus, countdown: DateCountDown|undefined}[] }>({});
    const [openBonusDrawer, setOpenBonusDrawer] = useState(false);
    const [bonusPositionId, setPositionIdForBonus] = useState<number>(-1);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: LongShort | undefined }>({});
    const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
    const [leverages, setLeverages] = useState<{ [key: number]: number }>({});
    const [expandedPairs, setExpandedPairs] = useState<{ [key: number]: boolean }>({});
    const [expandedBonuses, setExpandedBonuses] = useState<{ [key: number]: boolean }>({});
    const allowedLeverages = [0, 1, 2, 3, 5, 7, 10];  // Valid leverage options
    const [positions, setPositions] = useState<Position[]>([]);
    const [, setIsLoading] = useState(false);

    useEffect(() => {
        const defaultOptions: { [key: number]: LongShort } = {};
        spots.forEach((spot) => {
            defaultOptions[spot.id] = LongShort.Short;
        });

        setSelectedOptions(defaultOptions);
    }, [spots]);

    useEffect(() => {
        const initialAmounts: { [key: number]: number } = {};
        const initialLeverages: { [key: number]: number } = {};

        spots.forEach(spot => {
            initialAmounts[spot.id] = 0;  // Set initial amount to 0
            initialLeverages[spot.id] = 0;  // Set initial leverage to 0
        });

        setAmounts(initialAmounts);
        setLeverages(initialLeverages);
    }, [spots]);  // Re-run when pairs change

    useEffect(() => {
        fetchLatestPositions();
    }, []);

    const fetchLatestPositions = async () => {
        try {
            setIsLoading(true);
            setPositions(userProfile.positionStore?.positions ?? []);

            userProfile.positionStore?.positions.forEach((pos) => {
                if (pos.bonuses && pos.bonuses.length > 0) {
                    pos.bonuses.forEach(b => {
                        const bonusAndTimer = { bonus: b, countdown: new DateCountDown(b.end_date!) }

                        setExpandedBonuses((prev) => ({ 
                            ...prev, 
                            [pos.position_id]: true 
                        }));

                        if (!selectedBonuses[pos.position_id]) selectedBonuses[pos.position_id] = [];
                        selectedBonuses[pos.position_id].push(bonusAndTimer);

                        setBonusesForPosition((prev) => ({
                            ...prev,
                            [pos.position_id]: selectedBonuses[pos.position_id]
                        }));
                    });
                }
            });
        } catch (error) {
            console.error('Failed to fetch latest positions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (pairId: number) => {
        setExpandedPairs((prev) => ({
            ...prev,
            [pairId]: !prev[pairId],
        }));
    };

    const handleSelectOption = (pairId: number, option: LongShort) => {
        setSelectedOptions((prevOptions) => ({
            ...prevOptions,
            [pairId]: option,
        }));
    };

    const handleAmountChange = (pairId: number, value: number) => {
        const newValue = value; // New value to be set
        const userBalance = userProfile.trading_info.balance;

        if (newValue > userBalance) {
            toast.error("You don't have enough balance");
            return;
        }

        setAmounts((prevAmounts) => ({
            ...prevAmounts,
            [pairId]: newValue,
        }));
    };

    const handleLeverageChange = (pairId: number, leverage: number) => {
        if (allowedLeverages.includes(leverage)) {
            setLeverages((prevLeverages) => ({
                ...prevLeverages,
                [pairId]: leverage,
            }));
        }
    };

    const toggleExpandBonuses = (pairId: number) => {
        setExpandedBonuses((prev) => ({
            ...prev,
            [pairId]: !prev[pairId],
        }));
    };

    const handleSelectedBonusesChange = (bonuses: Bonus[]) => {
        if (positions[bonusPositionId]) { 
            bonuses.forEach(b => positions[bonusPositionId].attach_new_bonus(b));
        }

        const bonusAndTimer = bonuses.map(b => {
            if(b.end_date) return { bonus: b, countdown: new DateCountDown(b.end_date) };
            return { bonus: b, countdown: undefined };
        });
        
        setBonusesForPosition((prev) => ({
            ...prev,
            [bonusPositionId]: bonusAndTimer
        }));

        // We reset bonus related variables
        setOpenBonusDrawer(false);
        setPositionIdForBonus(-1);
    };

    const handleValidate = async (pairId: number): Promise<void> => {
        try {
            setIsLoading(true);

            // Sanity checks - always keep sanity checks
            if (!selectedOptions[pairId] || !leverages[pairId] || leverages[pairId] == 0) return;
            const pair = pairs.find(p => p.id == pairId);

            if (!pair) {
                console.error("Pair not found for id:", pairId);
                return;
            }

            const amt = Number(amounts[pairId]);
            const balanceAdjustment = await userProfile.AddPosition(pair, selectedOptions[pairId]!, amt || 0, leverages[pairId], selectedBonuses[pairId]?.map(b => b.bonus) ?? []);

            if (balanceAdjustment == undefined) {
                toast.info("Error validating position");
                return;
            }

            onValidatePosition(balanceAdjustment);            

            // Reset states
            setAmounts((prev) => ({ ...prev, [pairId]: 0 }));
            setSelectedOptions((prev) => ({ ...prev, [pairId]: undefined }));
            setLeverages((prev) => ({ ...prev, [pairId]: 0 }));
            setExpandedBonuses((prev) => ({ ...prev, [pairId]: false }));

            // Update available bonuses by filtering out the used ones
            //setBonusData(prevBonuses =>
            //    prevBonuses.filter(bonus =>
            //        !selectedBonuses.some(selected => selected.id === bonus.id)
            //    )
            //);

            // Fetch updated positions
            await fetchLatestPositions();

        } catch (error) {
            toast.error('Failed to validate position');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = async (pairId: number) => {
        try {
            setIsLoading(true);
            const pair = pairs.find(pair => pair.id === pairId);

            if (positions.find((pos: Position) => pos.position_id === pairId)) {
                const balanceAdjustment = await userProfile.ClosePosition(pairId);

                if (balanceAdjustment == undefined) {
                    toast.info("Error cancelling position");
                    return;
                }

                // Reset states
                setAmounts((prev) => ({ ...prev, [pairId]: 0 }));
                setLeverages((prev) => ({ ...prev, [pairId]: 0 }));

                onValidatePosition(balanceAdjustment);  

                // Fetch updated positions
                await fetchLatestPositions();

                toast.success(`${pair!.pair_symbol} closed successfully`);
            }
        } catch (error) {
            console.error('Error closing position:', error);
            toast.error('Failed to close position');
        } finally {
            setIsLoading(false);
        }
    };

    const printPositionAmount = (positionId: number): string => {
        const p = positions.find((pos) => pos.position_id === positionId);
        if (p) {
            return Utils.toCamelFormat(String(p.long_short)) + " " + p.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return 'No position';
    };

    return (
        <div className="mt-3">
            {globalThis.userProfile.unlocked_pairs.map((pair) => (
                <div key={pair.id} className="bg-[#32363C] bg-opacity-60 rounded-xl mb-3">
                    <div className="pt-3 pb-3 space-y-2">
                        <div className="flex justify-between items-center border-b border-gray-500 pb-2 mb-2 w-[93%] mx-auto">
                            <div className="space-x-2 flex-grow">
                                <span className="fw-bold">{pair.pair_symbol}</span>
                                <span className="space-x-2">
                                    <span className="fw-bold">
                                        <NumberFormat value={spots?.find(s => s.pair_id == pair.id)?.current_value ?? 0} decimals={2} />
                                    </span>
                                    <span
                                        className={`text-sm ${(spots?.find(s => s.pair_id == pair.id)?.period_return ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {(Number(spots?.find(s => s.pair_id == pair.id)?.period_return ?? 0) >= 0
                                            ? `(+${(Number(spots?.find(s => s.pair_id == pair.id)?.period_return ?? 0) * 100).toFixed(2)}%)`
                                            : `(${(Number(spots?.find(s => s.pair_id == pair.id)?.period_return ?? 0) * 100).toFixed(2)}%)`)}
                                    </span>
                                </span>
                            </div>
                            <button
                                className="text-sm text-white font-bold"
                                onClick={() => toggleExpand(pair.id)}
                            >
                                {expandedPairs[pair.id] ? '-' : '+'}
                            </button>
                        </div>

                        {expandedPairs[pair.id] && (
                            <>
                                <div className="flex justify-between border-b pl-3 pr-3 border-gray-500 mt-2">
                                    <div className="w-1/2">
                                        <span className="font-normal text-sm mb-2 block">Position</span>
                                    </div>
                                    <div className="w-1/2 text-right">
                                        <span className="font-normal text-sm mb-2 block">
                                            {printPositionAmount(pair.id)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between border-b pl-3 pr-3 border-gray-500 mt-2">
                                    <div className="w-1/2 mb-2">
                                        <span className="font-normal text-sm block">Performance to Date</span>
                                    </div>
                                    <div className="w-1/2 text-right mb-2">
                                        <span className="font-normal text-sm block">{((positions.find((pos) => pos.position_id === pair.id)?.performance ?? 0) * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                                <div className={`flex justify-between pl-3 pr-3 border-b border-gray-500 my-0 ${expandedBonuses[pair.id] ? 'bg-[#32363C]' : ''}`}>
                                    <div className="w-1/2 pt-2">
                                        <span className="font-normal text-sm block text-white mb-2">Bonuses</span>
                                    </div>
                                    <div className="w-1/2 text-right mt-1">
                                        <button
                                            onClick={() => toggleExpandBonuses(pair.id)}
                                            className="text-sm text-white font-bold"
                                            disabled={!selectedBonuses[pair.id] || selectedBonuses[pair.id].length === 0}
                                        >
                                            {expandedBonuses[pair.id] ? '-' : '+'}
                                        </button>
                                    </div>
                                </div>

                                {expandedBonuses[pair.id] && (
                                    <>
                                        {selectedBonuses[pair.id].map((b) => (
                                            <div key={b.bonus.id} className="flex justify-between border-b border-gray-500 pl-3 pr-3 my-0 bg-[#32363C] box-border">
                                                <div className="flex justify-between w-full">
                                                    <div className="w-1/2 mb-2 mt-2">
                                                        <span className="font-normal text-sm block">{b.bonus.bonus_definition.bonus_type}</span>
                                                    </div>
                                                    <div className="w-1/2 text-right mb-2 mt-2 flex items-center justify-end space-x-2">
                                                        <span className="font-normal text-sm block">+{b.bonus.bonus_definition.benefit}</span>
                                                        <span className="font-normal text-sm block">{b.countdown?.toString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}


                                <div className="flex 
                                -x-4 mt-2 pl-3 pr-3 space-x-2">
                                    <span
                                        className={`w-15 text-center font-bold text-xs py-1 px-2 rounded-md cursor-pointer ${selectedOptions[pair.id] === LongShort.Short ? 'bg-[#21242980] border-1' : ''}`}
                                        onClick={() => handleSelectOption(pair.id, LongShort.Short)}
                                    >
                                        Short
                                    </span>
                                    <span
                                        className={`w-15 text-center font-bold text-xs py-1 px-2 rounded-md cursor-pointer ${selectedOptions[pair.id] === LongShort.Long ? 'bg-[#21242980] border-1' : ''}`}
                                        onClick={() => handleSelectOption(pair.id, LongShort.Long)}
                                    >
                                        Long
                                    </span>
                                </div>

                                <div className="flex justify-between space-x-4 mt-2 px-3">
                                    <div className="">
                                        <span className="font-normal text-sm mb-2 block">Amount</span>
                                        <CounterInput
                                            value={amounts[pair.id] || 0}
                                            onChange={(value) => handleAmountChange(pair.id, value)} // Tăng giá trị
                                        />
                                    </div>
                                    <div className="">
                                        <span className="font-normal text-sm mb-2 block">Leverage</span>
                                        <CounterInput
                                            value={leverages[pair.id] || 0}
                                            onChange={(value) => handleLeverageChange(pair.id, value)}
                                            isLeverage={true} // Only leverage counter will be restricted to allowed values
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4 space-x-2 pl-3 pr-3">
                                    <button
                                        type="button"
                                        className={`rounded w-auto py-1 px-2 space-x-1
                                            ${amounts[pair.id] === 0 || leverages[pair.id] === 0
                                                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                                                : 'bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] flex items-center justify-center'
                                            }`}
                                        onClick={() => { setPositionIdForBonus(pair.id); setOpenBonusDrawer(true) }}
                                        disabled={amounts[pair.id] === 0 && !positions.find((pos) => pos.position_id === pair.id)}>

                                        <div className="flex items-center space-x-1"> {/* Add a container to align items horizontally */}
                                            <img
                                                src="/images/home/coin.png"
                                                alt="coin"
                                                className="object-cover w-4 h-4"
                                            />
                                            <span className="font-bold text-xs">Add Bonus</span>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className={`rounded flex-1 py-1 px-2 
                                            ${amounts[pair.id] === 0 || !leverages[pair.id] || !selectedOptions[pair.id]
                                                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                                                : 'bg-[linear-gradient(142.18deg,#3BB424_21.85%,#2AAA28_78.15%)]'
                                            }`}
                                        onClick={() => { if (amounts[pair.id] === 0 || !leverages[pair.id] || !selectedOptions[pair.id]) return; handleValidate(pair.id); }}
                                        disabled={amounts[pair.id] === 0 || leverages[pair.id] === 0}
                                    >
                                        <span className="font-bold text-xs">Validate</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`rounded flex-1 py-1 px-2 ${!positions.find((pos) => pos.position_id === pair.id) ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-[#F27A83]'}`}
                                        onClick={() => { if (!positions.find((pos) => pos.position_id === pair.id)) return; handleClose(pair.id); }}
                                    >
                                        <span className="font-bold text-xs">Close</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}

            {openBonusDrawer && globalThis.userProfile.positionStore!.available_bonuses.length > 0 && (
                <ListBonus
                    open={openBonusDrawer}
                    alreadySelectedBonuses={selectedBonuses[bonusPositionId]?.map(b => b.bonus) || []}
                    onOpenChange={setOpenBonusDrawer}
                    bonusData={filterAlreadySelectedBonuses(selectedBonuses[bonusPositionId]?.map(b => b.bonus) || [])}
                    onSelectBonuses={handleSelectedBonusesChange}
                />
            )}
        </div>
    );
};

const filterAlreadySelectedBonuses = (selectedBonuses: Bonus[]): Bonus[] => {
    if (!selectedBonuses) return globalThis.userProfile.positionStore!.available_bonuses;

    return globalThis.userProfile.positionStore!.available_bonuses.filter(bonus => !selectedBonuses.find(selected => selected.id === bonus.id));
}

export default TradingItem;
