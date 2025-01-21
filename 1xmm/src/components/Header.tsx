import { cn, Utils } from "@/lib/utils";
import React, { useState } from "react";
import Sidebar from "./partials/SidebarLeft";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { $http } from "@/lib/http";
import { Button } from "@mui/material";
import { userProfileStore } from "@/store/user-store";

// deprecated - to be removed
type HeaderProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
    amount_token?: number;
};

export default function Header({
    className,
    amount_token = 0,
    ...props
}: HeaderProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const images = import.meta.glob<{ default: string }>("../../public/images/avatars/*.jpg", { eager: true });
    const imagePaths = Object.values(images).map((module) => module.default);

    const sortedImagePaths = imagePaths.sort((a, b) => {
        const numberA = Utils.getAvatarRef(a);
        const numberB = Utils.getAvatarRef(b);
        
        return numberA - numberB;
    });

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index); // Update the selected image index
    };

    const {amount_of_tokens: userAmount1vMM} = userProfileStore();

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleUpdateAvatarId = async () => {
        const response = await $http.post('/update-user-avatar', { avatar_id: selectedImageIndex });
        if (response.data.success) {
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
                                <img className="object-contain w-12 h-12" src={`/images/avatars/avatar__${userProfile.avatar_id + 1}__.jpg`} />
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
                            {sortedImagePaths.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`img-${index}`}
                                    className={`cursor-pointer rounded-lg ${selectedImageIndex === index ? 'border-4 border-blue-500' : 'border-none' }`}
                                    onClick={() => handleImageClick(index)} // Handle image click
                                />
                            ))}
                        </div>
                        <Button variant="contained" onClick={handleUpdateAvatarId}>Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </header>
    );
}
