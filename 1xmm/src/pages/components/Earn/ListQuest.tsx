import React, { useState } from 'react';
import ModalEarn from './ModalEarn';
import { tasks } from '@/referential/tasks';
import { TaskDefinition } from '@/types/tasks/TaskDefinition';
const ListQuest: React.FC = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    console.log(tasks);
    const firstItemsByAction: TaskDefinition[] = Object.values(
        tasks.reduce<Record<string, TaskDefinition>>((acc, task) => {
            if (!acc[task.action_name]) {
                acc[task.action_name] = task;
            }
            return acc;
        }, {})
    );

    console.log(firstItemsByAction);

    return (
        <div className="bg-[#32363C] rounded-xl mt-2">
            {firstItemsByAction && firstItemsByAction.length && firstItemsByAction.map((task) => (
                <div
                    className="flex justify-between items-center p-3 border-b"
                    style={{ borderBottom: `.3px solid #FFFFFF33` }}
                >
                    <div className="flex items-center w-1/6">
                        <img
                            src="/images/earn/coinmarket.png"
                            alt="coinmarket"
                            className="w-8 h-8"
                        />
                    </div>
                    <div className="flex flex-col w-3/6">
                        <p className="text-sm">{task.name}</p>
                    </div>
                    <div className="w-2/6 justify-end">
                        <div className="flex items-center space-x-1 text-xs justify-end">
                            <span className="opacity-50">Bonus</span>
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-4 h-4"
                            />
                            <span>{task.reward_coins}</span>
                        </div>
                        <div className="flex justify-end pt-2">
                            <span className="text-center px-3 rounded-lg text-xs bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%);] py-1 fw-bold">Claim</span>
                        </div>
                    </div>
                </div>
            ))}

            <ModalEarn
                open={openDrawer}
                onOpenChange={setOpenDrawer}
            />
        </div>
    );
};

export default ListQuest;
