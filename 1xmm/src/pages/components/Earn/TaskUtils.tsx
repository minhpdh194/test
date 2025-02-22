import { TaskDefinition } from '@/types/tasks/TaskDefinition';
import { Question } from '@/types/tasks/Question';

export type FilteredTasks = {
    tasksInProgress: TaskDefinition[],
    allTasks: Record<string, TaskDefinition[]>
}

export const getRandomQuestions = (arr: Question[], n: number) => {
    const s = arr.length;
    const qi: number[] = [];

    let ni = 0;

    do {
        ni = Math.floor(Math.random() * s) + 1;
        if (!isInArray(qi, ni) && ni < s) qi.push(ni);
    } while (qi.length != n);

    return qi.map(i => arr[i]);
}

function isInArray(arr: number[], el: number): boolean {
    return arr.indexOf(el) !== -1;
}

export function getRandomDailyQuests<Question>(arr: Question[], count: number): Question[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5); // Shuffle array
    return shuffled.slice(0, count); // Get the first `count` elements
}