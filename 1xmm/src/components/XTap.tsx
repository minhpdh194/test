import React, { useEffect, useRef, useState } from "react";
import { useClicksStore } from "../store/clicks-store";
import { useDebounce } from "@uidotdev/usehooks";
import { $http } from "@/lib/http";

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
    const [userBalance, setUserBalance] = useState<number>(userProfile.trading_info.balance);

    const tabMe = (e: React.MouseEvent) => {
        e.preventDefault();

        if (userBalance < changeInBalance) return;

        setClicksCount((prev) => prev + 1);
        userProfile.UserTap();

        updateAmountOfTokens();

        setUserBalance(() => {
            return userProfile.trading_info.balance;
        });

        addClick({
            id: new Date().getTime(),
            value: userProfile.available_energy > 0 ? userProfile.earn_per_tap : 0,
            style: {
                insetBlockStart: e.clientY,
                insetInlineStart: e.clientX + (Math.random() > 0.5 ? 5 : -5),
            },
        });
    };

    useEffect(() => {
        setUserBalance(userBalance + changeInBalance);
    }, [changeInBalance]);

    useEffect(() => {
        const count = debounceClicksCount;
        setClicksCount(0);
        if (count === 0) return;

        $http
            .post<Record<string, any>>("/clicker/tap", {
                count,
                energy: 0,
                timestamp: Math.floor(Date.now() / 1000),
                earn_per_tap: userProfile.earn_per_tap,
            })
            .then(({ data }) => {
                if (data.leveled_up) {
                    userProfile.UserLevelUp();
                }
            })
            .catch(() => setClicksCount(count));
    }, [debounceClicksCount]);

    return (
        <div {...props}>
            <div className="relative">
                <button
                    className="btn-tap absolute -top-10 left-0 right-0"
                    ref={userTapButtonRef}
                    onPointerUp={tabMe}
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
