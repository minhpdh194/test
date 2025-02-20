import React, { useState } from 'react';
import ModalEarn from './ModalEarn';
import { $http } from '@/lib/http';
import { TaskDefinition } from '@/types/tasks/TaskDefinition';
import { toast } from 'react-toastify';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Radio } from '@mui/material';
import { getRandomQuestions } from './TaskUtils';
import { Question } from '@/types/tasks/Question';
import { Tasks } from '@/classes/Tasks';
import { TaskActionNames } from '@/enums';

const ListDailyQuest: React.FC = () => {
    //const TWITTER_CLIENT_ID: string = import.meta.env.VITE_TWITTER_CLIENT_ID;
    //const TWITTER_REDIRECT_URI: string = import.meta.env.VITE_TWITTER_REDIRECT_URI;
    const [tasks, updateTasks] = useState<Tasks>(new Tasks(userProfile.completed_task_ids, globalThis.dailyTasks));
    const [openDrawer, setOpenDrawer] = useState(false);
    const [questionPopup, setQuestionPopup] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<TaskDefinition>();
    const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);
    const [selectedRadios, setSelectedRadios] = useState<any>({});

    const renderTaskStatus = (task: TaskDefinition) => {
        let taskStatus;

        if ((task.action_name == TaskActionNames.AnswerQuestion
            || task.action_name == TaskActionNames.FreeToken
            || task.action_name == TaskActionNames.ReadXPost)
            && tasks.CurrentVideoTaskInProgress) {
            taskStatus = <>Claim</>;
        } else if (tasks.CompletedTaskIds.includes(task.id)) {
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
        setSelectedRadios((prev: any) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleTaskNavigation = (task: TaskDefinition) => {
        try {
            const markTask = $http.post('/task-in-progress', { task: task });
            setSelectedTask(task);

            markTask.then(() => {
                switch (task.action_name) {
                    case TaskActionNames.FreeToken:
                        claimTask(task);
                        break;
                    case TaskActionNames.AnswerQuestion:
                        handleAnswerQuestion(task);
                        break;
                    case TaskActionNames.ReadXPost:
                        handleJoin(task);
                        break;
                }
            });
        } catch (e) { }
    }

    const handleJoin = (task: TaskDefinition) => {
        if (tasks.IsWaitingToJoin(task)) return;
        tasks.WaitToJoin(task);

        const destinationUrl = task.link;

        if (destinationUrl.length > 0) {
            window.open(destinationUrl, '_blank')!;
        }

        tasks.CheckIfUserHasJoined(task);
        let count = 0;

        const checkThread = setInterval(() => {
            if (tasks.CompletedTaskIds.find(id => id === task.id)) {
                clearInterval(checkThread);
                claimTask(task);
                tasks.StopWaitingToJoin(task);
                setSelectedTask(undefined);
            } else if (count > 3) {
                clearInterval(checkThread);
                tasks.StopWaitingToJoin(task);
            }

            count++;
        }, 2500);
    }

    const handleAnswerQuestion = (task: TaskDefinition) => {
        if (tasks.CompletedTaskIds.includes(task.id)) return;
        tasks.CurrentVideoTaskInProgress = true;
        const selectedQuestions = getRandomQuestions(dailyQuests.filter(quest => quest.video_id == task.id), 2);
        setCurrentQuestions(selectedQuestions);
        setQuestionPopup(true);
        setSelectedCheckboxes([]);
        setSelectedRadios({});
    }

    const claimTask = async (task: TaskDefinition) => {
        try {
            const response = await $http.post('/claim-task', { task: task });

            if (response.data.success) {
                tasks.TaskHasBeenCompleted(task);
                updateTasks(new Tasks(userProfile.completed_task_ids, globalThis.dailyTasks));

                userProfile.available_task_ids = tasks.AvailableTasks.map(t => t.id);
                userProfile.completed_task_ids.push(task.id);
                userProfile.UpdateBalance(task.reward_coins);

                setSelectedTask(undefined);
            } else {
                toast.warning(response.data.message);
            }
        }
        catch (e) {
            toast.error("Task could not be claimed");
        }
    }

    const handleCloseDialog = () => {
        setQuestionPopup(false);
        setSelectedTask(undefined);
    }

    const handleSubmitAnswer = () => {
        setQuestionPopup(false);

        const combinedList = [
            ...Object.values(selectedCheckboxes).flat(),
            ...Object.values(selectedRadios),
        ];

        let result = true;

        combinedList.forEach(id => {
            const answer = dailyAnswers.find(answer => answer.id === id);
            if (answer && result) {
                result = result && answer.is_correct;
            }
        });

        if (selectedTask && combinedList.length > 0) {
            if (result) {
                claimTask(selectedTask);
            } else {
                toast.warning("Wrong answer");
            }
        }
    }

    return (
        <div className="bg-[#32363C] rounded-xl mt-2">
            {tasks.AvailableTasks.map((task) => (
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
                            {
                                dailyAnswers
                                    .filter((answer) => answer.question_id === question.id) // Filter answers by question_id
                                    .map((filteredAnswer, answerIndex) => (
                                        <div key={answerIndex}>
                                            {question.type === "multiple_choice" ? (
                                                <>
                                                    <Checkbox
                                                        onChange={(e: any) =>
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

export default ListDailyQuest;
