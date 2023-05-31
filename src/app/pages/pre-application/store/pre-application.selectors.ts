import {createFeatureSelector, createSelector} from "@ngrx/store";
import {PreApplicationState} from "./pre-application.reducer";

export const preAppFeatureKey = 'preAppFeatureKey';

const featureSelect = createFeatureSelector<PreApplicationState>(preAppFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: PreApplicationState) => state.subModules || []);

export const selectQuestionList$ =
    createSelector(featureSelect, (state: PreApplicationState) => state.questionList || []);
export const selectQuizList$ =
    createSelector(featureSelect, (state: PreApplicationState) => state.quizList || []);

