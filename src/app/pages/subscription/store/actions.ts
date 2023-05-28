import {createAction} from "@ngrx/store";
import {PlaceOrderResponse, SubscriptionDetailResponse, SubscriptionPlanResponse} from "../../../@Models/subscription";
const key = '[SUBSCRIPTION]';

export const loadSubscriptionPlans = createAction(`${key} load subscription plans`);
export const loadSubscriptionPlansSuccess = createAction(`${key} load subscription plans success`, (payload: {subscriptions: SubscriptionPlanResponse}) => payload);
export const placeorder = createAction(`${key} placeorder`, (payload: {subscription: any}) => payload.subscription);
export const placeorderSuccess = createAction(`${key} placeorder success`, (payload: {data: PlaceOrderResponse}) => payload);
export const placeorderFailure = createAction(`${key} placeorder failure`);
export const doneLoading = createAction(`${key} done loading`);
export const loadSubDetails = createAction(`${key} loadSubDetails`);
export const loadSubDetailsSuccess = createAction(`${key} loadSubDetails success`, (payload: {data: SubscriptionDetailResponse}) => payload);