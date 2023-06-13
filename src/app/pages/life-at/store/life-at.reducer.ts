import {LifeAtSubModules} from "../../../@Models/life-at.model";
import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./life-at.actions";
import {ListQuestion} from "../../../@Models/question-list.model";
import {loadQuestionListSuccess, loadQuizListSuccess} from "../../pre-application/store/pre-application.actions";

export interface LifeAtState {
    subModules?: LifeAtSubModules[],
    questionList?: ListQuestion[]
}

export const initialState: LifeAtState = {
    subModules: [],
    questionList: [],
}

export const LifeAtReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) =>
        ({...state, subModules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
    on(loadQuizListSuccess, (state, payload) => ({...state, quizList: payload.quizList})),
);