import React, { useEffect, useRef, useState } from "react";
import { useClicksStore } from "../store/clicks-store";
import { useDebounce } from "@uidotdev/usehooks";
import { $http } from "@/lib/http";
import { userProfileStore } from "@/store/user-store";

interface XTapProps extends React.HTMLProps<HTMLDivElement> {
    changeInBalance?: number;
    updateAmountOfTokens: () => void;
}

const XTap: React.FC<XTapProps> = ({ changeInBalance = 0, updateAmountOfTokens, ...props }) => {
    const userAnimateRef = useRef<HTMLDivElement | null>(null);
    const userTapButtonRef = useRef<HTMLButtonElement | null>(null);
    const [clicksCount, setClicksCount] = useState(0);
    const debounceClicksCount = useDebounce(clicksCount, 1000);
    const { clicks, addClick, removeClick } = useClicksStore();

    // Subscribe to the user balance from the Zustand store
    const { trading_info, earn_per_tap, UserTap } = userProfileStore();    
    const [ available_energy, setAvailableEnergy ] = useState(userProfileStore().available_energy);
    const { balance: userBalance } = trading_info;

    const tapMe = (e: React.MouseEvent) => {
        e.preventDefault();

        if (userBalance < changeInBalance) return;

        setClicksCount((prev) => prev + 1);
        UserTap(); // This updates the Zustand store

        updateAmountOfTokens();

        addClick({
            id: new Date().getTime(),
            value: available_energy >= earn_per_tap ? earn_per_tap : 0,
            style: {
                insetBlockStart: e.clientY,
                insetInlineStart: e.clientX + (Math.random() > 0.5 ? 5 : -5),
            },
        });
    };

    useEffect(() => {
        setAvailableEnergy(globalThis.userProfile.available_energy);
    }, [globalThis.userProfile.available_energy]);

    useEffect(() => {
        const count = debounceClicksCount;
        setClicksCount(0);
        if (count === 0) return;

        $http
            .post<Record<string, any>>("/clicker/tap", {
                count: count,
                earn_per_tap: earn_per_tap,
            })
            .catch(() => setClicksCount(count));
    }, [debounceClicksCount, earn_per_tap]);

    return (
        <div {...props}>
            <div className="relative">
                <div className="z-10 relative w-10 pt-2 pl-2">
                    <img
                        src="images/energy.svg"
                        className="w-10"
                        alt=""
                    />
                    <div className="w-10 text-center mt-1 text-sm font-bold">  {available_energy}</div>
                </div>

                <button
                    className="btn-tap absolute -top-10 left-0 right-0"
                    ref={userTapButtonRef}
                    onPointerUp={tapMe}
                >
                    <div className="flex items-center justify-center px-3 pt-12 pb-4">
                        <img alt="coins" className="h-12 w-12" src="/images/home/coin-light.png" />
                        <span className="text-md mt-2 text-4xl fw-bold">
                            {Math.floor(userBalance)?.toLocaleString()}
                        </span>
                    </div>
                </button>
            </div>

            <div ref={userAnimateRef} className="user-tap-animate">
                {clicks.map((click) => (
                    <div
                        key={click.id}
                        onAnimationEnd={() => removeClick(click.id)}
                        style={click.style}
                    >
                        +{click.value}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default XTap;
