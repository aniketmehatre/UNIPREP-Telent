import {createReducer, on} from "@ngrx/store";
import {loadQuestionListSuccess, loadSubModules, loadSubModulesSuccess} from "./pre-application.actions";
import { SubModuleList} from "../../../@Models/pre-application.model";
import {ListQuestion} from "../../../@Models/question-list.model";
export interface PreApplicationState {
    subModules?: SubModuleList[],
    questionList?: ListQuestion[]
}
export const initialState: PreApplicationState = {
    subModules: [],
    questionList: [],
}
export const  PreApplicationReducer= createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, subModules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
);