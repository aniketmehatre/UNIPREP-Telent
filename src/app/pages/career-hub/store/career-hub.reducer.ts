import {createReducer, on} from "@ngrx/store";
import {loadSubModulesSuccess} from "./career-hub.actions";
import {SubModuleList} from "../../../@Models/post-application.model";

export interface CareerHubState {
    submodules: SubModuleList[]
}

export const initialState: CareerHubState = {
    submodules: []
}
export const CareerHubReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state,
                               payload) => ({...state, submodules: payload.submodules})),
)