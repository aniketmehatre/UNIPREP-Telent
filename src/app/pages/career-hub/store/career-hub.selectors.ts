import {createFeatureSelector, createSelector} from "@ngrx/store";
import {CareerHubReducer, CareerHubState} from "./career-hub.reducer";

export const careerHubFeatureKey = 'careerHubFeatureKey';

const featureSelect = createFeatureSelector<CareerHubState>(careerHubFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: CareerHubState) => state.submodules || []);
