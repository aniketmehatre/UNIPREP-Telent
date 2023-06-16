import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ModuleStoreState} from "./module-store.reducer";

export const appFeatureKey = 'appFeatureKey';

const featureSelect = createFeatureSelector<ModuleStoreState>(appFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: ModuleStoreState) => state.subModules || []);

export const selectQuestionList$ =
    createSelector(featureSelect, (state: ModuleStoreState) => state.questionList || []);
export const selectQuizList$ =
    createSelector(featureSelect, (state: ModuleStoreState) => state.quizList || []);

export const readQuestion$ =
    createSelector(featureSelect, (state: ModuleStoreState) => state.readQue || []);

