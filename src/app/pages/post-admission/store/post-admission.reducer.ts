import {createReducer, on} from "@ngrx/store";
import {loadQuestionListSuccess, loadSubModulesSuccess} from "./post-admission.actions";
import {SubModuleList} from "../../../@Models/post-admission.model";
import {ListQuestion} from "../../../@Models/question-list.model";

export interface PostAdmissionState {
    submodules?: SubModuleList[],
    questionList?: ListQuestion[],
}

export const initialState: PostAdmissionState = {
    submodules: [],
    questionList: []
}
export const PostAdmissionReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, submodules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
);