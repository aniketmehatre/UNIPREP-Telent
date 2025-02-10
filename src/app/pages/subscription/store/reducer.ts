import {Billinginfo, OrderHistory, Subscription, SubscriptionPlan} from "../../../@Models/subscription";
import {createReducer, on} from "@ngrx/store";
import {
    doneLoading, loadSubDetailsSuccess,
    loadSubscriptionPlans,
    loadSubscriptionPlansSuccess,
    placeorder,
    placeorderFailure,
    placeorderSuccess
} from "./actions";

export interface SubscriptionState {
    plans: SubscriptionPlan[];
    loading: boolean;
    orderid: string;
    billinginfo: Billinginfo | null;
    subscription: Subscription | null;
    orderHistory: OrderHistory[];
}

export const initialState: SubscriptionState = {
    plans: [],
    loading: false,
    orderid: '',
    billinginfo: null,
    subscription: null,
    orderHistory: []
};

export const subscriptionReducer = createReducer(
    initialState,
    on(loadSubscriptionPlans, (state): SubscriptionState => ({...state, plans: []})),
    on(loadSubscriptionPlansSuccess, (state, {subscriptions}): SubscriptionState => ({
        ...state, 
        plans: subscriptions.subscriptions
    })),
    on(placeorder, (state): SubscriptionState => ({
        ...state, 
        loading: true, 
        orderid: ''
    })),
    on(placeorderSuccess, (state, {data}): SubscriptionState => ({
        ...state, 
        orderid: data.orderid
    })),
    on(placeorderFailure, (state): SubscriptionState => ({
        ...state, 
        loading: false, 
        orderid: ''
    })),
    on(doneLoading, (state): SubscriptionState => ({
        ...state, 
        loading: false, 
        orderid: ''
    })),
    on(loadSubDetailsSuccess, (state, {data}): SubscriptionState => ({
        ...state, 
        billinginfo: data.billinginfo, 
        subscription: data.subscription, 
        orderHistory: data.orderHistory
    }))
);