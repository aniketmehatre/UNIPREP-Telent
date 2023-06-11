import {createFeatureSelector, createSelector} from "@ngrx/store";
import {LifeAtState} from "./life-at.reducer";

export const lifeAtFeatureKey = 'lifeAtFeatureKey';

const featureSelect = createFeatureSelector<LifeAtState>(lifeAtFeatureKey);
export const selectSubModule$ =
    createSelector(featureSelect, (state: LifeAtState) => state.subModules || []);
