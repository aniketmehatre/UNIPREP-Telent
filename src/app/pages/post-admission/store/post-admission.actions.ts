import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/post-admission.model";
import {ListQuestion} from "../../../@Models/question-list.model";


export const loadSubModules = createAction('[POST Admission] load Sub modules', (payload: {countryId: number}) => payload);
export const loadSubModulesSuccess = createAction('[POST Admission] load sub modules success',
    (payload: {
        submodules: SubModuleList[]
    }) => payload);

export const loadQuestionList = createAction('[POST Admission] load question list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuestionListSuccess = createAction('[POST Admission] load question list success',
    (payload: {
        questionList: ListQuestion[]
    }) => payload);

