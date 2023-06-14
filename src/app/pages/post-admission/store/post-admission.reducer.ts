import {createReducer, on} from "@ngrx/store";
import {loadQuestionListSuccess, loadQuizListSuccess, loadSubModulesSuccess} from "./post-admission.actions";
import {SubModuleList} from "../../../@Models/post-admission.model";
import {ListQuestion} from "../../../@Models/question-list.model";
import {QuizList} from "../../../@Models/list-quiz.model";

export interface PostAdmissionState {
    submodules?: SubModuleList[],
    questionList?: ListQuestion[],
    quizList?: QuizList[]
}

export const initialState: PostAdmissionState = {
    submodules: [],
    questionList: [],
    quizList: [],
}
export const PostAdmissionReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state, payload) => ({...state, submodules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
    on(loadQuizListSuccess, (state, payload) => ({...state, quizList: payload.quizList})),


);