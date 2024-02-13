import { createReducer, on } from "@ngrx/store";
import {
    emptyQuestionList,
    loadQuestionListSuccess,
    loadQuizListSuccess,
    loadSubModulesSuccess, readQuestionSuccess,
} from "./module-store.actions";
import { ModuleListSub } from "../../@Models/module.model";
import { ListQuestion, QuestionList } from "../../@Models/question-list.model";
import { QuizList } from "../../@Models/list-quiz.model";
import { ReadQuestion } from "../../@Models/read-question.model";
import { state } from "@angular/animations";


export interface ModuleStoreState {
    subModules?: ModuleListSub[],
    questionList?: QuestionList
    quizList?: QuizList[]
    readQue?: ReadQuestion[]
}

export const initialState: ModuleStoreState = {
    subModules: [],
    questionList: {
        status: '',
        questioncount: 0,
        questions: []
    },
    quizList: [],
    readQue: []
}
export const ModuleStoreReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({ ...state, subModules: payload.submodules })),
    on(loadQuestionListSuccess, (state, payload) => ({ ...state, questionList: payload.questionList })),
    on(emptyQuestionList, (state) => ({
        ...state, questionList: {
            status: '',
            questioncount: 0,
            questions: []
        }
    })),
    on(loadQuizListSuccess, (state, payload) => ({ ...state, quizList: payload.quizList })),
    on(readQuestionSuccess, (state, payload) => ({ ...state, readQue: payload.readQue })),
);