import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PageState} from './pages.reducer';

export const pagesFeatureKey = 'pageSelector';

export const selectFeature = createFeatureSelector<PageState>(pagesFeatureKey);

export const selectSideBarState = createSelector(selectFeature, state => state.showSidebar);