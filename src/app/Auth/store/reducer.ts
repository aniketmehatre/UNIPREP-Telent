import {createReducer, on} from "@ngrx/store";
import {login, loginFailure, loginSuccess} from "./actions";

export interface AuthState {
    loading: boolean;
    message: string;
    loggedIn: boolean;
    data: any;
}

export const initialState: AuthState = {
    loading: false,
    message: '',
    loggedIn: false,
    data: '',
}

export const authReducer = createReducer(
    initialState,
    on(login, (state: AuthState) => ({...state, loading: true, message: '', loggedIn: false, data: ''})),
    on(loginSuccess, (state: AuthState, payload) => ({...state, loading: false, message: 'Login Success', loggedIn: true, data: payload})),
    on(loginFailure, (state: AuthState) => ({...state, loading: false, message: '', loggedIn: false, data: ''}))
);