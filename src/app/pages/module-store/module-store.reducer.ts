import {createReducer, on} from "@ngrx/store";
import {
    loadQuestionListSuccess,
    loadQuizListSuccess,
    loadSubModulesSuccess, readQuestionSuccess,
} from "./module-store.actions";
import {ModuleListSub} from "../../@Models/module.model";
import {ListQuestion} from "../../@Models/question-list.model";
import {QuizList} from "../../@Models/list-quiz.model";
import {ReadQuestion} from "../../@Models/read-question.model";


export interface ModuleStoreState {
    subModules?: ModuleListSub[],
    questionList?: ListQuestion[]
    quizList?: QuizList[]
    readQue?: ReadQuestion[]
}

export const initialState: ModuleStoreState = {
    subModules: [],
    questionList: [],
    quizList: [],
    readQue: []
}
export const ModuleStoreReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, subModules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
    on(loadQuizListSuccess, (state, payload) => ({...state, quizList: payload.quizList})),
    on(readQuestionSuccess, (state, payload) => ({...state, readQue: payload.readQue})),
);