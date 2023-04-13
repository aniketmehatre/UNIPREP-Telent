import {createReducer, on} from "@ngrx/store";
import {loadSubModules, loadSubModulesSuccess} from "./pre-application.actions";
import { SubModuleList} from "../../../@Models/pre-application.model";
export interface PreApplicationState {
    subModules?: SubModuleList[];
}
export const initialState: PreApplicationState = {
    subModules: [],
}
export const  PreApplicationReducer= createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, subModules: payload.submodules})),
);