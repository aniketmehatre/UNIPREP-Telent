import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./post-admission.actions";
import {SubModuleList} from "../../../@Models/post-admission.model";

export interface PostAdmissionState {
    submodules?: SubModuleList[];
}

export const initialState: PostAdmissionState = {
    submodules: [],
}
export const PostAdmissionReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, submodules: payload.submodules})),
);