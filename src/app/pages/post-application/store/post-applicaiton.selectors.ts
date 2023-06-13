import {createAction, createFeatureSelector, createSelector} from "@ngrx/store";
import {PostApplicationState} from "./post-application.reducer";
import {QuizList} from "../../../@Models/list-quiz.model";
import {PreApplicationState} from "../../pre-application/store/pre-application.reducer";

export const postApplicationFeatureKey = 'postApplicationFeatureKey';

const featureSelect = createFeatureSelector<PostApplicationState>(postApplicationFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: PostApplicationState) => state.submodules || []);
export const selectQuestionList$ =
    createSelector(featureSelect, (state: PostApplicationState) => state.questionList || []);


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

export const selectQuizList$ =
    createSelector(featureSelect, (state: PreApplicationState) => state.quizList || []);

