import {createReducer, on} from "@ngrx/store";
import {toggleSideBar} from "./pages.actions";

export interface PageState {
    showSidebar: boolean;
}

export const initialState: PageState = {
    showSidebar: false
};

export const pagesReducer = createReducer(
    initialState,
    on(toggleSideBar, (state: PageState, payload) => {
        return {...state, showSidebar: payload.state};
    })
);