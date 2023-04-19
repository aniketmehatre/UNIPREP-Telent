import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/post-application.model";

export const loadSubModules = createAction('[POST APPLICATION] load sub modules', (payload: {countryId: number}) => payload)
export const loadSubModulesSuccess = createAction('[POST APPLICATION] post application load',
    (payload: {
        submodules: SubModuleList[]
    }) => payload)