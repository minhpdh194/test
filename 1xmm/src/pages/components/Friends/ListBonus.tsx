import React from 'react';
const ListBonus: React.FC = () => {
    return (
        <div className="flex justify-between items-center pb-2 pt-3" style={{ borderBottom: `.3px solid #FFFFFF33` }}>
            <div className="block">
                <p className="text-sm font-bold">
                    Have 3 ref
                </p>
                <div className="flex items-center space-x-1">
                    <img
                        src="/images/home/coin.png"
                        alt="coin"
                        className="h-4 w-4"
                    />
                    <span className="text-sm">1.61K</span>
                </div>
            </div>
            <div className="p-2 text-sm rounded-lg px-3 bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%);]">
               Claim 
            </div>
        </div>
    );
};

export default ListBonus;
