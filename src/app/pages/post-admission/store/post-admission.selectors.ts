import {createFeatureSelector, createSelector} from "@ngrx/store";
import {PostAdmissionState} from "./post-admission.reducer";

export const postAdmissionFeatureKey = 'postAdmissionFeatureKey';

const featureSelect = createFeatureSelector<PostAdmissionState>(postAdmissionFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: PostAdmissionState) => state.submodules || []);

export const selectQuestionList$ =
    createSelector(featureSelect, (state: PostAdmissionState) => state.questionList || []);

export const selectQuizList$ =
    createSelector(featureSelect, (state: PostAdmissionState) => state.quizList || []);

