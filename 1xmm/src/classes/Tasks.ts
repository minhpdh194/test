import { TaskDefinition } from '@/types/tasks/TaskDefinition';
import { getAllTasks } from "@/referential/tasks";
import { TaskActionNames } from '@/enums';


export class Tasks {
    public CurrentVideoTaskInProgress: boolean;
    public AvailableTasks: TaskDefinition[];
    public CompletedTaskIds: number[];

    private indicesOfTasksInProgress: Record<string, number>;
    private joinInProgress: number[];
    private allTasks: Record<string, TaskDefinition[]>;

    public constructor(completedIds: number[]) {
        const allTasks = getAllTasks;

        this.CurrentVideoTaskInProgress = false;
        this.CompletedTaskIds = completedIds;
        this.AvailableTasks = [];
        this.joinInProgress = [];
        this.indicesOfTasksInProgress = {};
        this.allTasks = {};

        // First, we filter the tasks
        for (const task of allTasks) {
            if (!this.allTasks[task.action_name]) { this.allTasks[task.action_name] = []; }
            this.allTasks[task.action_name].push(task);
        }

        // Then, for each category, we select tasks that have not been completed
        // For Join tasks, the add all tasks
        // For other tasks, we select the one with the lowest completion requirement which has not been completed
        for (const actionName in this.allTasks) {
            const groupTasks = this.allTasks[actionName];

            if (actionName === "Join") {
                const remainingJoinTasks = groupTasks.filter((t) => !completedIds.includes(t.id));
                this.AvailableTasks.push(...remainingJoinTasks); 
            } else {
                const sortedTasks = groupTasks.sort((a, b) => a.complete_requirement - b.complete_requirement);
                this.allTasks[actionName] = sortedTasks;

                var nextTask = sortedTasks.find((t) => !completedIds.includes(t.id));

                if (nextTask) {
                    this.indicesOfTasksInProgress[actionName] = sortedTasks.indexOf(nextTask);
                    this.AvailableTasks.push(nextTask);
                }
            }
        }
    }

    public IsWaitingToJoin(task: TaskDefinition): boolean {
        return this.joinInProgress.includes(task.id);
    }

    public WaitToJoin(task: TaskDefinition): void {
        if (!this.joinInProgress.includes(task.id)) this.joinInProgress.push(task.id);
    }

    public StopWaitingToJoin(task: TaskDefinition): void {
        this.joinInProgress = this.joinInProgress.filter((id) => id !== task.id);
    }

    public TaskHasBeenCompleted(task: TaskDefinition): void {
        this.AvailableTasks = this.AvailableTasks.filter((t) => t.id !== task.id);
        this.CompletedTaskIds.push(task.id);

        const nextTask = this.GetNextTask(task);

        if (nextTask) {
            this.AvailableTasks.push(nextTask);
        }
    }

    public async CheckIfUserHasJoined(task: TaskDefinition): Promise<void> {
        if (task.action_name == TaskActionNames.JoinX || task.action_name == TaskActionNames.JoinTelegram || task.action_name == TaskActionNames.JoinDiscord) {
            this.TaskHasBeenCompleted(task);
        }
    }

    private GetNextTask(current_task: TaskDefinition): TaskDefinition | undefined {
        const next_index = this.indicesOfTasksInProgress[current_task.action_name] + 1;
        if (next_index >= this.allTasks[current_task.action_name].length) { return undefined; }
        this.indicesOfTasksInProgress[current_task.action_name] += 1;

        if (current_task.action_name == TaskActionNames.Watch1XMMVideo || current_task.action_name == TaskActionNames.WatchExtVideo) this.CurrentVideoTaskInProgress = false;

        return this.allTasks[current_task.action_name][this.indicesOfTasksInProgress[current_task.action_name]];
    }
}