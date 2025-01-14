import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import Sidebar from "./partials/SidebarLeft";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "@mui/material";
import { $http } from "@/lib/http";
import { toast } from "react-toastify";

type HeaderProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
    amount_token?: number;
};

export default function Header({
    className,
    amount_token = 0,
    ...props
}: HeaderProps) {
    const [userAmount1vMM, setUserAmount1vMM] = useState<number>(userProfile.amount_of_tokens);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const images = import.meta.glob<{ default: string }>("../../public/images/avatar/*.jpg", { eager: true });
    const imagePaths = Object.values(images).map((module) => module.default);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index); // Update the selected image index
    };

    // Update local state when user balance changes or when validatedAmount changes
    useEffect(() => {
        // Subscribe to balance changes from the store
        setUserAmount1vMM(amount_token);
    }, [amount_token]);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleUpdateAvatarId = async () => {
        const response = await $http.post('/update-user-avatar', { avatar_id: selectedImageIndex });
        if (response.data.success) {
            toast.success(response.data.message);
            userProfile.UpdateUserAvatar(selectedImageIndex);
        }
        setIsOpen(false);
    }

    return (
        <header className={cn("mt-2", className)}
            {...props}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 py-2">
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <div className="bg-white rounded w-12 h-12" onClick={() => setIsOpen(true)}>
                                <img className="object-contain w-12 h-12" src={`/images/avatar/avatar_${userProfile.avatar_id}.jpg`} />
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

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="popup-body w-[calc(100%-2rem)]">
                    <div className="flex flex-col items-center justify-center text-center">
                        <DialogTitle className="text-black text-xl font-bold">
                            Avatar selection
                        </DialogTitle>
                        <div className="grid grid-cols-3 gap-4">
                            {imagePaths.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`img-${index}`}
                                    className={`cursor-pointer rounded-lg ${selectedImageIndex === index ? 'border-4 border-blue-500' : 'border-none'
                                        }`}
                                    onClick={() => handleImageClick(index)} // Handle image click
                                />
                            ))}
                        </div>
                        <Button onClick={handleUpdateAvatarId}>Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
}
