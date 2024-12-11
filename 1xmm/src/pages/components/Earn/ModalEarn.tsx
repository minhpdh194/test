// import { useState } from "react";
// import { Button } from "../../../components/ui/button";
import Drawer, { DrawerProps } from "../../../components/ui/drawer";
import { useMutation } from "@tanstack/react-query";
// import { $http } from "@/lib/http";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
// import { Mission, MissionLevel } from "@/types/MissionType";
 // import { UserType } from "@/types/UserType";
// import { useUserStore } from "@/store/user-store";
// import { useMemo } from "react";

export default function ModalEarn({
    ...props
}: DrawerProps) {
    // const queryClient = useQueryClient();
    // const { balance } = useUserStore();


    const upgradeMution = useMutation({
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "An error occurred");
        },
    });

    return (
        <Drawer {...props}>
            <img
                src="/images/home/coin.png"
                alt="coin"
                className="h-32 mx-auto flex justify-center"
            />
            <h2 className="mt-6 text-2xl font-medium text-center">Watch Youtube Video</h2>
            <div className="flex items-center justify-center mx-auto mt-6 space-x-1 text-white">
                <img
                    src="/images/home/coin.png"
                    alt="coin"
                    className="object-contain w-6 h-6"
                />
                <span className="font-bold">
                    500
                </span>
            </div>
            <button
                className="w-full mt-6 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] rounded-lg p-3"
            >
                {upgradeMution.isPending && (
                    <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
                )}
                {"Go ahead"}
            </button>
        </Drawer>
    );
}
