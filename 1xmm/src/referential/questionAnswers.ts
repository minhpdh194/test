import { QuestionAnswer } from "@/types/tasks/QuestionAnswer";

const answerList = [
    {
        description: "Answer 1",
        is_correct: false,
        question_id: 1
    },
    {
        description: "Answer 2",
        is_correct: false,
        question_id: 1
    },
    {
        description: "Answer 3",
        is_correct: true,
        question_id: 1
    },
    {
        description: "Answer 1",
        is_correct: false,
        question_id: 1
    },
    {
        description: "Answer 2",
        is_correct: false,
        question_id: 1
    },
    {
        description: "Answer 3",
        is_correct: true,
        question_id: 6
    },
    {
        description: "Answer 1",
        is_correct: false,
        question_id: 5
    },
    {
        description: "Answer 2",
        is_correct: false,
        question_id: 7
    },
    {
        description: "Answer 3",
        is_correct: true,
        question_id: 8
    },
    {
        description: "Answer 1",
        is_correct: false,
        question_id: 3
    },
    {
        description: "Answer 2",
        is_correct: false,
        question_id: 2
    },
    {
        description: "Answer 3",
        is_correct: true,
        question_id: 1
    },
    {
        description: "Answer 1",
        is_correct: false,
        question_id: 5
    },
    {
        description: "Answer 2",
        is_correct: false,
        question_id: 2
    },
    {
        description: "Answer 3",
        is_correct: true,
        question_id: 5
    },
];

export const answers: Array<QuestionAnswer> = answerList.map((answer, index) =>
    createAnswer(
        index + 1,
        answer.description,
        answer.is_correct,
        answer.question_id
    )
);

function createAnswer(
    id: number,
    description: string,
    is_correct: boolean,
    question_id: number
): QuestionAnswer {
    return {
        id,
        description,
        is_correct,
        question_id,
    };
}
