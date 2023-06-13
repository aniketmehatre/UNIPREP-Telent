import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/university.model";
import {ListQuestion} from "../../../@Models/question-list.model";


export const loadSubModules = createAction('[UNIVERSITY] load Sub modules', (payload: {
    countryId: number
}) => payload);
export const loadSubModulesSuccess = createAction('[UNIVERSITY] load sub modules success',
    (payload: {
        submodules: SubModuleList[]
    }) => payload);
export const loadQuestionList = createAction('[UNIVERSITY] load question list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuestionListSuccess = createAction('[UNIVERSITY] load question list success',
    (payload: {
        questionList: ListQuestion[]
    }) => payload);