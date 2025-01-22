import { Question } from "@/types/tasks/Question";

const questionList = [
    {
        description: "Description 1",
        task_id: 1,
        type: "single_choice"
    },
    {
        description: "Description 2",
        task_id: 1,
        type: "single_choice"
    },
    {
        description: "Description 3",
        task_id: 1,
        type: "single_choice"
    },
    {
        description: "Description 4",
        task_id: 1,
        type: "single_choice"
    },
    {
        description: "Description 5",
        task_id: 1,
        type: "single_choice"
    },
    {
        description: "Description 6",
        task_id: 1,
        type: "single_choice"
    },
    {
        description: "Description 7",
        task_id: 1,
        type: "multiple_choice"
    },
    {
        description: "Description 8",
        task_id: 1,
        type: "multiple_choice"
    },
    {
        description: "Description 9",
        task_id: 1,
        type: "multiple_choice"
    },
    {
        description: "Description 10",
        task_id: 1,
        type: "multiple_choice"
    },
];

export const questions: Array<Question> = questionList.map((question, index) =>
    createQuestion(
        index + 1,
        question.description,
        question.task_id,
        question.type,
    )
);

function createQuestion(
    id: number,
    description: string,
    task_id: number,
    type: string,
): Question {
    return {
        id,
        description,
        task_id,
        type,
    };
}
