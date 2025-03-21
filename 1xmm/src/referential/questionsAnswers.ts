import { Question } from "@/types/tasks/Question";
import { Answer } from "@/types/tasks/Answer";

import { questionList1, answerList1 } from "./questions_answers/video_1";
import { questionList2, answerList2 } from "./questions_answers/video_2";
import { questionList3, answerList3 } from "./questions_answers/video_3";

export const getQuestions = (video_id: number): Array<Question> => {
    if (video_id == 1) return questionList1.map((question, index) => { 
        return {
            id: index + 1,
            description: question.description,
            video_id: video_id,
            type: question.type,
        }
    });

    if (video_id == 2) return questionList2.map((question, index) => { 
        return {
            id: index + 1,
            description: question.description,
            video_id: video_id,
            type: question.type,
        }
    });

    if (video_id == 3) return questionList3.map((question, index) => { 
        return {
            id: index + 1,
            description: question.description,
            video_id: video_id,
            type: question.type,
        }
    });

    return [];
};

export const getAnswers = (video_id: number): Array<Answer> => {
    if (video_id == 1) return answerList1.map((answer, index) => {
        return {
            id: index + 1,
            description: answer.description,
            is_correct: answer.is_correct,
            question_id: answer.question_id
        }
    });

    if (video_id == 2) return answerList2.map((answer, index) => {
        return {
            id: index + 1,
            description: answer.description,
            is_correct: answer.is_correct,
            question_id: answer.question_id
        }
    });

    if (video_id == 3) return answerList3.map((answer, index) => {
        return {
            id: index + 1,
            description: answer.description,
            is_correct: answer.is_correct,
            question_id: answer.question_id
        }
    });

    return [];
};
