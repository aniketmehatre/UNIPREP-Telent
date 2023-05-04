import {createFeatureSelector, createSelector} from "@ngrx/store";
import {PostApplicationState} from "./post-application.reducer";

export const postApplicationFeatureKey = 'postApplicationFeatureKey';

const featureSelect = createFeatureSelector<PostApplicationState>(postApplicationFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: PostApplicationState) => state.submodules || []);
export const selectQuestionList$ =
    createSelector(featureSelect, (state: PostApplicationState) => state.questionList || []);

