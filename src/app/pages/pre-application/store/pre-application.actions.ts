import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/pre-application.model";
import {ListQuestion} from "../../../@Models/question-list.model";


export const loadSubModules = createAction('[PRE Application] load Sub modules', (payload: {
    countryId: number
}) => payload);
export const loadSubModulesSuccess = createAction('[PRE Application] load sub modules success',
    (payload: {
        submodules: SubModuleList[]
    }) => payload);
// [{countryId: number}, {moduleId: number}, {submoduleId: number}]
export const loadQuestionList = createAction('[PRE Application] load question list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuestionListSuccess = createAction('[PRE Application] load question list success',
    (payload: {
        questionList: ListQuestion[]
    }) => payload);

