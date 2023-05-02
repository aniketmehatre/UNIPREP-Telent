import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./career-hub.actions";
import {SubModuleList} from "../../../@Models/post-application.model";
import {loadQuestionListSuccess} from "../../pre-application/store/pre-application.actions";
import {ListQuestion} from "../../../@Models/question-list.model";

export interface CareerHubState {
    submodules: SubModuleList[],
    questionList?: ListQuestion[]
}

export const initialState: CareerHubState = {
    submodules: [],
    questionList: [],
}
export const CareerHubReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state,
                               payload) => ({...state, submodules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),

)