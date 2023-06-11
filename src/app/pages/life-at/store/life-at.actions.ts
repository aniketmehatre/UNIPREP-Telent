import {createAction} from "@ngrx/store";
import {LifeAtSubModules} from "../../../@Models/life-at.model";
import {ListQuestion} from "../../../@Models/question-list.model";


export const loadSubModules = createAction('[LIFE AT] load Sub modules', (payload: {
    countryId: number
}) => payload);
export const loadSubModulesSuccess = createAction('[LIFE AT] load sub modules success',
    (payload: {
        submodules: LifeAtSubModules[]
    }) => payload);

export const loadQuestionList = createAction('[LIFE AT] load question list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuestionListSuccess = createAction('[LIFE AT] load question list success',
    (payload: {
        questionList: ListQuestion[]
    }) => payload);