import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/post-admission.model";


export const loadSubModules = createAction('[POST Admission] load Sub modules', (payload: {countryId: number}) => payload);
export const loadSubModulesSuccess = createAction('[POST Admission] load sub modules success',
    (payload: {
        submodules: SubModuleList[]
    }) => payload);

