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

type TradingItemProps = {
    validatedAmounts: any;
    spots: SpotType[];
    onValidateAmount: (amount: number) => void;
};

const TradingItem = ({ spots, onValidateAmount }: TradingItemProps) => {
    // const [, setTimeBonus] = useState(null);
    const [bonusData, setBonusData] = useState<any[]>([]);
    const [openBonusDrawer, setOpenBonusDrawer] = useState(false);
    const [selectedBonuses, setSelectedBonuses] = useState<any[]>([]); // Store selected bonuses
    const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: LongShort }>({});
    const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
    const [leverages, setLeverages] = useState<{ [key: number]: number }>({});
    const [expandedPairs, setExpandedPairs] = useState<{ [key: number]: boolean }>({});
    const [expandedBonuses, setExpandedBonuses] = useState<{ [key: number]: boolean }>({});
    const allowedLeverages = [0, 1, 2, 3, 5, 7, 10];  // Valid leverage options
    const [positions, setPositions] = useState<Position[]>([]);
    const [, setIsLoading] = useState(false);

    const pairs = JSON.parse(localStorage.getItem("PairReferential") || "[]") as Pair[];

    useEffect(() => {
        fetchLatestPositions();
    }, []);

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

    //useEffect(() => {
    //    const fetchBenefitData = async () => {
    //        const benefitData = await $http.get("/level-benefit");
    //        setTimeBonus(benefitData.data.time_bonus);
    //    }; 
    //    fetchBenefitData();
    //}, []);

    //useEffect(() => {
    //    const fetchBonusData = async () => {
    //        const telegramResponse = await $http.get("/telegram-bonus");
    //        const filteredBonuses = telegramResponse.data.filter((bonus: any) => bonus.end_date == null);
    //        setBonusData([...filteredBonuses]);
    //    };
    //    fetchBonusData();
    //}, []);

    const fetchLatestPositions = async () => {
        try {
            setIsLoading(true);
            setPositions(userProfile.positionStore?.positions ?? []);
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

    const handleSelectedBonusesChange = (bonuses: any[]) => {
        setSelectedBonuses(bonuses);
    };

    const handleValidate = async (pairId: number): Promise<void> => {
        try {
            setIsLoading(true);
            const pair = pairs.find(p => p.id == pairId);

            if (!pair) {
                console.error("Pair not found for id:", pairId);
                return;
            }

            const amt = Number(amounts[pairId]);
            onValidateAmount(amt);

            userProfile.AddPosition(pair, selectedOptions[pairId], amt || 0, leverages[pairId] || 0, selectedBonuses);

            // Reset states
            setAmounts((prev) => ({ ...prev, [pairId]: 0 }));
            setLeverages((prev) => ({ ...prev, [pairId]: 0 }));
            setExpandedBonuses((prev) => ({ ...prev, [pairId]: false }));
            setSelectedBonuses([]); // Reset selected bonuses

            // Update available bonuses by filtering out the used ones
            setBonusData(prevBonuses =>
                prevBonuses.filter(bonus =>
                    !selectedBonuses.some(selected => selected.id === bonus.id)
                )
            );

            // Fetch updated positions
            await fetchLatestPositions();

        } catch (error) {
            console.error('Error validating position:', error);
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
                userProfile.ClosePosition(pairId);

                // Reset states
                setAmounts((prev) => ({ ...prev, [pairId]: 0 }));
                setLeverages((prev) => ({ ...prev, [pairId]: 0 }));

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
                                        className={`text-sm ${(spots?.find(s => s.pair_id == pair.id)?.daily_return ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {(Number(spots?.find(s => s.pair_id == pair.id)?.daily_return ?? 0) >= 0
                                            ? `(+${(Number(spots?.find(s => s.pair_id == pair.id)?.daily_return ?? 0) * 100).toFixed(2)}%)`
                                            : `(${(Number(spots?.find(s => s.pair_id == pair.id)?.daily_return ?? 0) * 100).toFixed(2)}%)`)}
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
                                            {positions.find((pos) => pos.position_id === pair.id)
                                                ? `${Utils.toCamelFormat(String(positions.find((pos) => pos.position_id === pair.id)?.long_short))} [${(positions.find((pos) => pos.position_id === pair.id)?.get_Return(Utils.getPositionTimestamp()) ?? 0).toFixed(2)}%]`
                                                : 'No position'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between border-b pl-3 pr-3 border-gray-500 mt-2">
                                    <div className="w-1/2 mb-2">
                                        <span className="font-normal text-sm block">Performance to Date</span>
                                    </div>
                                    <div className="w-1/2 text-right mb-2">
                                        <span className="font-normal text-sm block">0%</span>
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
                                            disabled={selectedBonuses.length === 0}
                                        >
                                            {expandedBonuses[pair.id] ? '-' : '+'}
                                        </button>
                                    </div>
                                </div>

                                {expandedBonuses[pair.id] && (
                                    <>
                                        {selectedBonuses.map((bonus) => (
                                            <div key={bonus.id} className="flex justify-between border-b border-gray-500 pl-3 pr-3 my-0 bg-[#32363C] box-border">
                                                <div className="flex justify-between w-full">
                                                    <div className="w-1/2 mb-2 mt-2">
                                                        <span className="font-normal text-sm block">{bonus.bonus_type}</span>
                                                    </div>
                                                    <div className="w-1/2 text-right mb-2 mt-2 flex items-center justify-end space-x-2">
                                                        <img
                                                            src="/images/home/coin.png"
                                                            alt="coin"
                                                            className="object-cover w-4 h-4"
                                                        />
                                                        <span className="font-normal text-sm block">${bonus.cost}</span>
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

                                <div className="flex justify-between space-x-4 mt-2 pl-3 pr-3">
                                    <div className="w-1/2 flex justify-center">
                                        <div className="w-full pl-3">
                                            <span className="font-normal text-sm mb-2 block">Amount</span>
                                            <CounterInput
                                                value={amounts[pair.id] || 0}
                                                onChange={(value) => handleAmountChange(pair.id, value)} // Tăng giá trị
                                            />
                                        </div>
                                    </div>
                                    <div className="w-1/2 pl-1">
                                        <div className="w-full">
                                            <span className="font-normal text-sm mb-2 block">Leverage</span>
                                            <CounterInput
                                                value={leverages[pair.id] || 0}
                                                onChange={(value) => handleLeverageChange(pair.id, value)}
                                                isLeverage={true} // Only leverage counter will be restricted to allowed values
                                            />
                                        </div>
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
                                        onClick={() => setOpenBonusDrawer(true)}
                                        disabled={amounts[pair.id] === 0 || leverages[pair.id] === 0}
                                    >

                                        <div className="flex items-center space-x-1"> {/* Add a container to align items horizontally */}
                                            <img
                                                src="/images/home/coin.png"
                                                alt="coin"
                                                className="object-cover w-4 h-4"
                                            />
                                            <span className="font-bold text-xs">Add Bonus</span>
                                        </div>                                    </button>




                                    <button
                                        type="button"
                                        className={`rounded flex-1 py-1 px-2 
                            ${amounts[pair.id] === 0 || leverages[pair.id] === 0 || !selectedOptions[pair.id]
                                                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                                                : 'bg-[linear-gradient(142.18deg,#3BB424_21.85%,#2AAA28_78.15%)]'
                                            }`}
                                        onClick={() => handleValidate(pair.id)}
                                        disabled={amounts[pair.id] === 0 || leverages[pair.id] === 0}
                                    >
                                        <span className="font-bold text-xs">Validate</span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`rounded flex-1 py-1 px-2 ${!selectedOptions[pair.id] ? 'bg-gray-400 opacity-50 cursor-not-allowed' : 'bg-[#F27A83]'}`}
                                        onClick={() => handleClose(pair.id)}
                                    >
                                        <span className="font-bold text-xs">Close</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ))}

            {openBonusDrawer && bonusData.length > 0 && (
                <ListBonus
                    open={openBonusDrawer}
                    onOpenChange={setOpenBonusDrawer}
                    bonusData={bonusData}
                    onSelectBonuses={handleSelectedBonusesChange} // Pass the selected bonuses handler
                />
            )}
        </div>
    );
};

export default TradingItem;
