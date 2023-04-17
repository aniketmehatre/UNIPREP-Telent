import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./post-application.actions";
import {SubModuleList} from "../../../@Models/post-application.model";

export interface PostApplicationState {
    submodules: SubModuleList[]
}

export const initialState: PostApplicationState = {
    submodules: []
}
export const PostApplicationReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state,
                               payload) => ({...state, submodules: payload.submodules})),
)