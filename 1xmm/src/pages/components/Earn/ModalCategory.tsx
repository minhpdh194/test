// import { useState } from "react";
import Drawer, { DrawerProps } from "../../../components/ui/drawer";
export default function ModezlEarn({
    ...props
}: DrawerProps) {
    return (
        <Drawer {...props}>
            <h2 className="text-xl font-medium text-center uppercase mb-3">Quest Categories</h2>
            <div className="pb-6">
                <div className="p-2 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%)] flex justify-between"
                    style={{ borderBottom: `.3px solid #FFFFFF33` }}
                >
                    <span className="font-bold">
                        Name
                    </span>
                    <span className="font-bold">
                        Bounus
                    </span>
                </div>
                <div className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                    <span className="text-sm">
                        Watch Youtube Video
                    </span>
                    <span className="text-sm">
                        $100
                    </span>
                </div>
                <div className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                    <span className="text-sm">
                        Watch Youtube Video
                    </span>
                    <span className="text-sm">
                        $100
                    </span>
                </div>
                <div className="p-2 flex justify-between" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
                    <span className="text-sm">
                        Watch Youtube Video
                    </span>
                    <span className="text-sm">
                        $100
                    </span>
                </div>
            </div>
        </Drawer>
    );
}
