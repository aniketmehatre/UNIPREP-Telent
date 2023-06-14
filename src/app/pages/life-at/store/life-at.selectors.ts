import {createFeatureSelector, createSelector} from "@ngrx/store";
import {LifeAtState} from "./life-at.reducer";
import {PreApplicationState} from "../../pre-application/store/pre-application.reducer";
import {preAppFeatureKey} from "../../pre-application/store/pre-application.selectors";

export const lifeAtFeatureKey = 'lifeAtFeatureKey';

const featureSelect = createFeatureSelector<LifeAtState>(lifeAtFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: LifeAtState) => state.subModules || []);

export const selectQuestionList$ =
    createSelector(featureSelect, (state: LifeAtState) => state.questionList || []);
export const selectQuizList$ =
    createSelector(featureSelect, (state: PreApplicationState) => state.quizList || []);

