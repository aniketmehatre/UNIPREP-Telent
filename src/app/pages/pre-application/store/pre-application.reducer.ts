import {createReducer, on} from "@ngrx/store";
import {loadQuestionListSuccess, loadQuizListSuccess, loadSubModulesSuccess} from "./pre-application.actions";
import {SubModuleList} from "../../../@Models/pre-application.model";
import {ListQuestion} from "../../../@Models/question-list.model";
import {ListQuiz, QuizList} from "../../../@Models/list-quiz.model";

export interface PreApplicationState {
    subModules?: SubModuleList[],
    questionList?: ListQuestion[]
    quizList?: QuizList[]
}

export const initialState: PreApplicationState = {
    subModules: [],
    questionList: [],
    quizList: [],
}
export const PreApplicationReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, subModules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
    on(loadQuizListSuccess, (state, payload) => ({...state, quizList: payload.quizList})),
);