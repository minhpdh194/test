import React, { useEffect, useState } from 'react';
import ModalEarn from './ModalEarn';
import { tasks } from '@/referential/tasks';
import { TaskDefinition } from '@/types/tasks/TaskDefinition';
import { $http } from '@/lib/http';
import { toast } from 'react-toastify';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Radio } from '@mui/material';
import { Question } from '@/types/tasks/Question';
import { questions } from '@/referential/questions';
import { answers } from '@/referential/questionAnswers';

const ListQuest: React.FC = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [inProgressTaskIds, setInProgressTaskIds] = useState<number[]>(userProfile.available_task_ids);
    const [completedTaskIds, setCompletedTaskIds] = useState<number[]>(userProfile.completed_task_ids);
    const [availableTasks, setAvailableTasks] = useState<TaskDefinition[]>([]);
    const [questionPopup, setQuestionPopup] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<TaskDefinition>();
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
    const [selectedRadios, setSelectedRadios] = useState<any>({});

    function getQuestionByTaskId(arr: Question[], taskId: number) {
        return arr.filter(item => item.task_id === taskId);
    }

    const getRandomQuestion = (arr: Question[], n: number) => {
        const shuffled = arr.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, n);
    }

    const getTasksWithCompletion = (tasks: TaskDefinition[], completedIds: number[]) => {
        const completedSet = new Set(completedIds);
        const result: TaskDefinition[] = [];
        const actionTypeMap: Record<string, TaskDefinition[]> = {};

        for (const task of tasks) {
            if (!actionTypeMap[task.action_name]) {
                actionTypeMap[task.action_name] = [];
            }
            actionTypeMap[task.action_name].push(task);
        }

        for (const actionName in actionTypeMap) {
            const group = actionTypeMap[actionName];

            const completedTasks = group.filter((task) => completedSet.has(task.id));
            const uncompletedTasks = group.filter((task) => !completedSet.has(task.id));

            result.push(...completedTasks);

            if (uncompletedTasks.length > 0) {
                result.push(uncompletedTasks[0]);
            }
        }

        return result;
    };

    useEffect(() => {
        const tasksWithIds = tasks.map((task, index) => ({
            ...task,
            id: task.id || index + 1,
        }));
        const tasksToShow = getTasksWithCompletion(tasksWithIds, completedTaskIds);

        setAvailableTasks(tasksToShow);
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

    const handleCheckboxChange = (checked: any, value: number) => {
        setSelectedCheckboxes(prev =>
            checked ? [...prev, value] : prev.filter(val => val !== value)
        );
    };

    const handleRadioChange = (questionId: number, value: number) => {
        console.log(questionId, value);
        setSelectedRadios((prev: any) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleFriendInvitationTasks = (task: TaskDefinition) => {
        if (userInvitedFriends.length >= Number(task.complete_requirement)) {
            handleTaskAction(task);
        } else {
            toast.error("You cannot claim this task");
        }
    }

    const handleWatchVideo = (task: TaskDefinition) => {
        const videoUrl = task.link;
        if (!completedTaskIds.includes(task.id)) {
            if (videoUrl.length > 0 && !inProgressTaskIds.includes(task.id)) {
                window.open(videoUrl, '_blank'); // Opens the link in a new tab
                handleTaskAction(task);
            }
            const availableQuestions = getQuestionByTaskId(questions, task.id);
            const filteredQuestions = getRandomQuestion(availableQuestions, 2);

            if (inProgressTaskIds.includes(task.id)) {
                setCurrentQuestions(filteredQuestions);
                setSelectedTask(task);
                setQuestionPopup(true);
                setSelectedCheckboxes([]);
                setSelectedRadios({});
            }
        } else {
            console.error("Video URL is not available");
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
                        if (nextTask && nextTask.action_name === task.action_name) {
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

    const handleCloseDialog = () => {
        setQuestionPopup(false);
    }

    const handleSubmitAnswer = () => {
        setQuestionPopup(false);

        const combinedList = [
            ...Object.values(selectedCheckboxes).flat(),
            ...Object.values(selectedRadios),
        ];

        console.log(combinedList);
        let result = true;

        combinedList.forEach(id => {
            const answer = answers.find(answer => answer.id === id);
            if (answer && result) {
                result = answer.is_correct;
            }
        });

        if (result && selectedTask && combinedList.length > 0) {
            handleTaskAction(selectedTask);
        } else {
            toast.warning("Wrong answer");
        }
    }

    const handleJoin = (task: TaskDefinition) => {
        const destinationUrl = task.link;
        if (!completedTaskIds.includes(task.id)) {
            if (destinationUrl.length > 0 && !inProgressTaskIds.includes(task.id)) {
                window.open(destinationUrl, '_blank'); // Opens the link in a new tab
            }
            handleTaskAction(task);
        } else {
            console.error("Video URL is not available");
        }
    }

    const handleTaskNavigation = (task: TaskDefinition) => {
        if (task.action_name === "invite") {
            handleFriendInvitationTasks(task);
        } else if (task.action_name === "watch_video") {
            handleWatchVideo(task);
        } else if (task.action_name === "join") {
            handleJoin(task);
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
                                onClick={() => handleTaskNavigation(task)}
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

            {selectedTask && currentQuestions.length > 0 && (
                <Dialog open={questionPopup} onClose={() => handleCloseDialog()} fullWidth>
                    <DialogTitle>{selectedTask.name}</DialogTitle>
                    {currentQuestions.map((question, index) => (
                        <DialogContent key={index}>
                            {index + 1}. {question.description}
                            {answers &&
                                answers
                                    .filter((answer) => answer.question_id === question.id) // Filter answers by question_id
                                    .map((filteredAnswer, answerIndex) => (
                                        <div key={answerIndex}>
                                            {question.type === "multiple_choice" ? (
                                                <>
                                                    <Checkbox
                                                        onChange={(e) =>
                                                            handleCheckboxChange(e.target.checked, filteredAnswer.id)
                                                        }
                                                    />
                                                    {filteredAnswer.description}
                                                </>
                                            ) : (
                                                <>
                                                    <Radio
                                                        value={filteredAnswer.id}
                                                        checked={selectedRadios[question.id] === filteredAnswer.id}
                                                        onChange={() =>
                                                            handleRadioChange(question.id, filteredAnswer.id)
                                                        }
                                                    />
                                                    {filteredAnswer.description}
                                                </>
                                            )}
                                        </div>
                                    ))}
                        </DialogContent>
                    ))}
                    <DialogActions>
                        <Button onClick={() => setQuestionPopup(false)} color="primary">
                            Close
                        </Button>
                        <Button onClick={() => handleSubmitAnswer()} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </div>
    );
};

export default ListQuest;
