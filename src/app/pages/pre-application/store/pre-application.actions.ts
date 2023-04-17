import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/pre-application.model";


export const loadSubModules = createAction('[PRE Application] load Sub modules');
export const loadSubModulesSuccess = createAction('[PRE Application] load sub modules success',
    (payload: {
        submodules: SubModuleList[]
    }) => payload);

