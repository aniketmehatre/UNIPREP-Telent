import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/post-application.model";
import {ListQuestion} from "../../../@Models/question-list.model";

export const loadSubModules = createAction('[POST APPLICATION] load sub modules', (payload: {countryId: number}) => payload)
export const loadSubModulesSuccess = createAction('[POST APPLICATION] post application load',
    (payload: {
        submodules: SubModuleList[]
    }) => payload)

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

