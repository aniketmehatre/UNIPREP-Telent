import {createReducer, on} from "@ngrx/store";
import {ListQuestion} from "../../../@Models/question-list.model";
import {ListQuiz, QuizList} from "../../../@Models/list-quiz.model";
import {SubModuleList} from "../../../@Models/university.model";
import {loadQuestionListSuccess, loadSubModulesSuccess} from "./university.actions";

export interface UniversityState {
    subModules?: SubModuleList[],
    questionList?: ListQuestion[]
    quizList?: QuizList[]
}

export const initialState: UniversityState = {
    subModules: [],
    questionList: [],
    quizList: [],
}
export const UniversityReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, subModules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
);