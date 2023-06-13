import {createFeatureSelector, createSelector} from "@ngrx/store";
import {UniversityState} from "./university.reducer";

export const universityFeatureKey = 'universityFeatureKey';

const featureSelect = createFeatureSelector<UniversityState>(universityFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: UniversityState) => state.subModules || []);

export const selectQuestionList$ =
    createSelector(featureSelect, (state: UniversityState) => state.questionList || []);

