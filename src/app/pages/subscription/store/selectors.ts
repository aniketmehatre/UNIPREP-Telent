import {createFeatureSelector, createSelector} from "@ngrx/store";
import {SubscriptionState} from "./reducer";

export const subscriptionFeatureKey = 'subscriptionFeatureKey';

const featureSelect = createFeatureSelector<SubscriptionState>(subscriptionFeatureKey);

export const selectPlans$ = createSelector(featureSelect, (state) => state.plans);
export const selectLoading$ = createSelector(featureSelect, (state) => state.loading);
export const selectOrderId$ = createSelector(featureSelect, (state) => state.orderid);
export const selectBillingInfo$ = createSelector(featureSelect, (state) => state.billinginfo);
export const selectSubscriptionDetail$ = createSelector(featureSelect, (state) => state.subscription);
export const selectOrderHistory$ = createSelector(featureSelect, (state) => state.orderHistory);