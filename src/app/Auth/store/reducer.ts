import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './actions';

export interface AuthState {
  loading: boolean;
  loggedIn: boolean;
  message: string | null;
  loginData: any;
  error: string | null;
}

export const initialState: AuthState = {
  loading: false,
  loggedIn: false,
  message: null,
  loginData: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    loading: false,
    loggedIn: true,
    message: 'Login Success',
    loginData: token,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loggedIn: false,
    message: 'Login Failed',
    error: error || 'Unknown error occurred'
  }))
);