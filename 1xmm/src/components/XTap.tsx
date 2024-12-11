import React, { useEffect, useRef, useState } from "react";
import { useClicksStore } from "../store/clicks-store";
import { useUserStore } from "../store/user-store";
import { useDebounce } from "@uidotdev/usehooks";
import { $http } from "@/lib/http";
import Decimal from 'decimal.js';

interface XTapProps extends React.HTMLProps<HTMLDivElement> {
    validatedAmounts?: number;
}

const XTap: React.FC<XTapProps> = ({ validatedAmounts = 0, ...props }) => {
    const userAnimateRef = useRef<HTMLDivElement | null>(null);
    const userTapButtonRef = useRef<HTMLButtonElement | null>(null);
    const [clicksCount, setClicksCount] = useState(0);
    const debounceClicksCount = useDebounce(clicksCount, 1000);

    const { clicks, addClick, removeClick } = useClicksStore();
    const { UserTap, ...user } = useUserStore();

    const [userBalance, setUserBalance] = useState<number>(user.balance);

    const tabMe = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!UserTap() || userBalance < validatedAmounts) return;

        setClicksCount((prev) => prev + 1);

        setUserBalance((prevBalance) => {
            const newBalance = new Decimal(prevBalance)
                .plus(new Decimal(user.benefitData.gain_per_tap))
                .toFixed(6); // Limit to 6 decimal places

            return new Decimal(newBalance).toNumber();
        });

        addClick({
            id: new Date().getTime(),
            value: parseFloat(user.benefitData.gain_per_tap),
            style: {
                insetBlockStart: e.clientY,
                insetInlineStart: e.clientX + (Math.random() > 0.5 ? 5 : -5),
            },
        });
    };

    useEffect(() => {
        setUserBalance(parseFloat(userBalance.toString()) - parseFloat(validatedAmounts.toString()));
    }, [validatedAmounts]);

    useEffect(() => {
        const count = debounceClicksCount;
        setClicksCount(0);
        if (count === 0) return;

        $http
            .post<Record<string, any>>("/clicker/tap", {
                count,
                energy: 0,
                timestamp: Math.floor(Date.now() / 1000),
            })
            .then(({ data }) => {
                if (data.leveled_up) {
                    useUserStore.setState({
                        level: data.level || user.level,
                        earn_per_tap: data.earn_per_tap,
                    });
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
