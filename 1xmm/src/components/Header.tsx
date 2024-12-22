import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import Sidebar from "./partials/SidebarLeft";

type HeaderProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
    amount_token?: number;
};

export default function Header({
    className,
    amount_token = 0,
    ...props
}: HeaderProps) {
    const [userAmount1vMM, setUserAmount1vMM] = useState(userProfile.amount_of_tokens);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Update local state when user balance changes or when validatedAmount changes
    useEffect(() => {
        // Subscribe to balance changes from the store
        setUserAmount1vMM(amount_token);
    }, [amount_token]);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <header className={cn("mt-2", className)}
            {...props}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 py-2">
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <div className="bg-white rounded w-12 h-12">
                            </div>
                        </div>
                        <div className="flex-2">
                            <p className="text-sm font-bold">
                                {userProfile?.first_name} {userProfile?.last_name}
                            </p>
                            <p className="text-sm font-medium flex items-center mt-2">
                                <img
                                    src="/images/home/trophy.png"
                                    alt="trophy"
                                    className="w-4 h-4"
                                /> &nbsp;
                                <span>
                                    Level {userProfile.level}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 py-2">
                    <img
                        src="/images/home/coin.png"
                        alt="coin"
                        className="object-cover w-6 h-6"
                    />
                    <p className="text-sm font-semibold">
                        +{Math.floor(userAmount1vMM)?.toLocaleString()}
                    </p>
                    <img
                        src="/images/home/setting.png"
                        alt="coin"
                        className="object-cover w-8 h-8"
                        onClick={toggleSidebar}
                    />
                </div>
            </div>
            {isSidebarOpen && (
                <Sidebar toggleSidebar={toggleSidebar} />
            )}
        </header>
    );
}
