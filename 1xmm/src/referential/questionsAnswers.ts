import { Question } from "@/types/tasks/Question";
import { Answer } from "@/types/tasks/Answer";
import i18next from "i18next";

import { questionList1, answerList1 } from "./questions_answers/video_1";
import { questionList2, answerList2 } from "./questions_answers/video_2";
import { questionList3, answerList3 } from "./questions_answers/video_3";
import { questionList4, answerList4 } from "./questions_answers/video_4";
import { questionList5, answerList5 } from "./questions_answers/video_5";

export type QuestionType = {
    description: { [key: string]: string };
    type: string;
};

export type AnswerType = {
    description: { [key: string]: string };
    is_correct: boolean;
    question_id: number;
};

const allQuestions: Array<Array<QuestionType>> = [
    questionList1,
    questionList2,
    questionList3,
    questionList4,
    questionList5,
];

const allAnswers: Array<Array<AnswerType>> = [
    answerList1,
    answerList2,
    answerList3,
    answerList4,
    answerList5,
];

const getText = (description: { [key: string]: string }): string => {
    switch (i18next.language) {
        case "fr": return description.fr;
        case "es": return description.es;
        default: return description.en;
    }
};


export const getQuestions = (video_id: number): Array<Question> => {
    const questions = allQuestions[video_id - 1];
    if (questions) return questions.map((question, index) => {
        return {
            id: index + 1,
            description: getText(question.description),
            video_id: video_id,
            type: question.type,
        };
    });

    return [];
};

export const getAnswers = (video_id: number): Array<Answer> => {
    const answers = allAnswers[video_id - 1];
    if (answers) return answers.map((answer, index) => {
        return {
            id: index + 1,
            description: getText(answer.description),
            is_correct: answer.is_correct,
            question_id: answer.question_id
        }
    });

    return [];
};
