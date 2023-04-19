import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/career-hub.model";

export const loadSubModules = createAction('[CAREER HUB] load sub modules', (payload: {countryId: number}) => payload)
export const loadSubModulesSuccess = createAction('[CAREER HUB] career hub load',
    (payload: {
        submodules: SubModuleList[]
    }) => payload)