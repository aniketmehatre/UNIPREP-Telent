import {createAction} from "@ngrx/store";
import {SubModuleList} from "../../../@Models/career-hub.model";
import {ListQuestion} from "../../../@Models/question-list.model";
import {QuizList} from "../../../@Models/list-quiz.model";

export const loadSubModules = createAction('[CAREER HUB] load sub modules', (payload: { countryId: number }) => payload)
export const loadSubModulesSuccess = createAction('[CAREER HUB] career hub load',
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

export const loadQuizList = createAction('[PRE Application] load quiz list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuizListSuccess = createAction('[PRE Application] load quiz list success',
    (payload: {
        quizList: QuizList[]
    }) => payload);

