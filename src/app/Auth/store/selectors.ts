import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './reducer';

export const authFeatureKey = 'authFeatureKey';

const featureSelect = createFeatureSelector<AuthState>(authFeatureKey);

// Use optional chaining and fallback values to handle undefined state
export const selectLoading$ = createSelector(
  featureSelect,
  (state: AuthState) => state?.loading ?? false
);

export const selectMessage$ = createSelector(
  featureSelect,
  (state: AuthState) => state?.message ?? ''
);

export const selectloggedIn$ = createSelector(
  featureSelect,
  (state: AuthState) => state?.loggedIn ?? false
);

export const loginData$ = createSelector(
  featureSelect,
  (state: AuthState) => state?.data ?? null
);
