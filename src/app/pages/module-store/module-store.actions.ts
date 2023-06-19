import {createAction} from "@ngrx/store";
import {ModuleListSub} from "../../@Models/module.model";
import {ListQuestion} from "../../@Models/question-list.model";
import {QuizList} from "../../@Models/list-quiz.model";


export const loadSubModules = createAction('[Modules] load Sub modules',
    (payload: {
        countryId: number,
        api_module_name: string
    }) => payload);
export const loadSubModulesSuccess = createAction('[Modules] load sub modules success',
    (payload: {
        submodules: ModuleListSub[]
    }) => payload);
export const loadQuestionList = createAction('[Modules] load question list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuestionListSuccess = createAction('[Modules] load question list success',
    (payload: {
        questionList: ListQuestion[]
    }) => payload);
export const loadQuizList = createAction('[Modules] load quiz list',
    (payload: {
        countryId: number,
        moduleId: number,
        submoduleId: number
    }) => payload);
export const loadQuizListSuccess = createAction('[Modules] load quiz list success',
    (payload: {
        quizList: QuizList[]
    }) => payload);

export const readQuestion = createAction('[Modules] read que modules', (payload: {
    countryId: number,
    questionId: number,
}) => payload);

export const readQuestionSuccess = createAction('[Modules] readQuestion success',
    (payload) => payload);