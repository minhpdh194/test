import { cn } from "@/lib/utils";
import { useUserStore, useUserProfileStore } from "@/store/user-store";
import React, { useState, useEffect } from "react";
import Sidebar from "./partials/SidebarLeft";

type HeaderProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
    validatedAmount?: number;
};

export default function Header({
    className,
    validatedAmount = 0,
    ...props
}: HeaderProps) {
    const user = useUserStore();
    const userProfile = useUserProfileStore();
    const [userBalance, setUserBalance] = useState(user.balance);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Update local state when user balance changes or when validatedAmount changes
    useEffect(() => {
        // Subscribe to balance changes from the store
        setUserBalance(user.balance - validatedAmount);
    }, [user.balance, validatedAmount]);

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
                                {user?.first_name} {user?.last_name}
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
                        +{Math.floor(userBalance)?.toLocaleString()}
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
