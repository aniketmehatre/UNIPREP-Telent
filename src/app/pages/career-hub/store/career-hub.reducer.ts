import {createReducer, on} from "@ngrx/store";
import {loadQuestionListSuccess, loadQuizListSuccess, loadSubModulesSuccess} from "./career-hub.actions";
import {SubModuleList} from "../../../@Models/post-application.model";
import {ListQuestion} from "../../../@Models/question-list.model";
import {QuizList} from "../../../@Models/list-quiz.model";

export interface CareerHubState {
    submodules: SubModuleList[],
    questionList?: ListQuestion[],
    quizList?: QuizList[]
}

export const initialState: CareerHubState = {
    submodules: [],
    questionList: [],
    quizList: [],
}
export const CareerHubReducer = createReducer(
    initialState,
    on(loadSubModulesSuccess, (state,
                               payload) => ({...state, submodules: payload.submodules})),
    on(loadQuestionListSuccess, (state, payload) => ({...state, questionList: payload.questionList})),
    on(loadQuizListSuccess, (state, payload) => ({...state, quizList: payload.quizList})),

)