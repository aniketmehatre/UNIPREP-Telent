import { createAction } from '@ngrx/store';

export const toggleSideBar = createAction('[SIDEBAR] Toogle State', (payload: {state: boolean}) => payload);