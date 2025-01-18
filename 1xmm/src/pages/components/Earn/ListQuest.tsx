import React, { useEffect, useState } from 'react';
import ModalEarn from './ModalEarn';
import { tasks } from '@/referential/tasks';
import { TaskDefinition } from '@/types/tasks/TaskDefinition';
import { $http } from '@/lib/http';
import { toast } from 'react-toastify';
const ListQuest: React.FC = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [inProgressTaskIds, setInProgressTaskIds] = useState<number[]>(userProfile.available_task_ids);
    const [completedTaskIds, setCompletedTaskIds] = useState<number[]>(userProfile.completed_task_ids);
    const [availableTasks, setAvailableTasks] = useState<TaskDefinition[]>([]);

    useEffect(() => {
        const tasksToAdd: any[] = [];

        tasks.forEach((task, index) => {
            if (task.type === "life_time") {
                if (completedTaskIds.includes(task.id)) {
                    tasksToAdd.push(task);

                    const nextTask = tasks.slice(index + 1).find(next => next.type === "life_time" && !completedTaskIds.includes(next.id));

                    if (nextTask) {
                        tasksToAdd.push(nextTask);
                    }
                }
            } else {
                tasksToAdd.push(task);
            }
        });

        const uniqueTasks = Array.from(new Set(tasksToAdd.map(task => task.id)))
            .map(id => tasksToAdd.find(task => task.id === id)).sort((a, b) => a.id - b.id);

        setAvailableTasks(uniqueTasks);
    }, []);

    const renderTaskStatus = (task: TaskDefinition) => {
        let taskStatus;

        if (inProgressTaskIds.includes(task.id)) {
            taskStatus = <>Claim</>;
        } else if (completedTaskIds.includes(task.id)) {
            taskStatus = <>Completed</>;
        } else {
            taskStatus = <>Get</>;
        }

        return taskStatus;
    }

    const handleFriendInvitationTasks = (task: TaskDefinition) => {
        if (userInvitedFriends.length >= Number(task.complete_requirement)) {
            handleTaskAction(task);
        } else {
            toast.error("You cannot claim this task");
        }
    }

    const handleTaskAction = async (task: TaskDefinition) => {
        if (inProgressTaskIds.includes(task.id)) {
            try {
                const response = await $http.post('/claim-task', {
                    task: task
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    setInProgressTaskIds(prev => prev.filter(id => id !== task.id));
                    setCompletedTaskIds(prev => [...prev, task.id]);
                    userProfile.available_task_ids = userProfile.available_task_ids.filter(id => id !== task.id);
                    userProfile.completed_task_ids.push(task.id);
                    userProfile.UpdateBalance(task.reward_coins);
                    if (task.type === "life_time") {
                        const nextTask = tasks.find(nextTask => nextTask.id === task.id + 1);
                        if (nextTask) {
                            setAvailableTasks(prevTasks => [...prevTasks, nextTask]);
                        }
                    }
                } else {
                    toast.warning(response.data.message);
                }
            }
            catch (e) {
                toast.error("You cannot claim this task");
            }
        } else if (!completedTaskIds.includes(task.id)) {
            try {
                const response = await $http.post('/receive-task', {
                    task: task
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    setInProgressTaskIds(prev => [...prev, task.id]);
                    userProfile.available_task_ids.push(task.id);
                } else {
                    toast.warning(response.data.message);
                }
            }
            catch (e) {
                toast.error("You cannot get this task");
            }
        } else {
            toast.warning("You have already claim the reward");
        }
    }

    return (
        <div className="bg-[#32363C] rounded-xl mt-2">
            {availableTasks && availableTasks.length > 0 && availableTasks.map((task) => (
                <div
                    key={task.id}
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
                        <p className="text-xs">{task.description}</p>
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
                            <span
                                onClick={() => {
                                    if (task.action_name === "invite") {
                                        handleFriendInvitationTasks(task);
                                    } else {
                                        handleTaskAction(task);
                                    }
                                }}
                                className={`text-center px-3 rounded-lg text-xs 
                                bg-[linear-gradient(142.18deg,#5155DA_21.85%,#2B2D74_78.15%);] 
                                py-1 fw-bold pointer`}>
                                {renderTaskStatus(task)}
                            </span>
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
