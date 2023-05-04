import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CareerHubState} from "./career-hub.reducer";

export const careerHubFeatureKey = 'careerHubFeatureKey';

const featureSelect = createFeatureSelector<CareerHubState>(careerHubFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: CareerHubState) => state.submodules || []);
export const selectQuestionList$ =
    createSelector(featureSelect, (state: CareerHubState) => state.questionList || []);