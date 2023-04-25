import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./post-application.actions";
import {SubModuleList} from "../../../@Models/post-application.model";
import {loadQuestionListSuccess} from "../../pre-application/store/pre-application.actions";
import {ListQuestion} from "../../../@Models/question-list.model";

export interface PostApplicationState {
    submodules: SubModuleList[],
    questionList?: ListQuestion[]
}

export const initialState: PostApplicationState = {
    submodules: [],
    questionList: [],
}
export const PostApplicationReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state,
                               payload) => ({...state, submodules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),

)