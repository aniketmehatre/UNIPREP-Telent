import {LifeAtSubModules} from "../../../@Models/life-at.model";
import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./life-at.actions";

export interface LifeAtState {
    subModules?: LifeAtSubModules[],
}

export const initialState: LifeAtState = {
    subModules: []
}

export const LifeAtReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) =>
        ({...state, subModules: payload.submodules})),
);