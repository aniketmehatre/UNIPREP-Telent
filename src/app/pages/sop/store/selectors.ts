import {createFeatureSelector, createSelector} from "@ngrx/store";
import {SopState} from "./reducer";

export const sopFeatureKey = 'sopFeatureKey';

const featureSelect = createFeatureSelector<SopState>(sopFeatureKey);

export const selectDocId$ = createSelector(featureSelect, (state: SopState) => state.docId);
export const selectStage$ = createSelector(featureSelect, (state: SopState) => state.stage);
export const selectDocument$ = createSelector(featureSelect, (state: SopState) => state.document || '');


export const selectUploadedDoc$ = createSelector(featureSelect, (state: SopState) => state.document || '');
export const selectCourses$ = createSelector(featureSelect, (state: SopState) => state.courses || []);
export const selectCountries$ = createSelector(featureSelect, (state: SopState) => state.countries || []);
export const selectCountryUnivercity$ = createSelector(featureSelect, (state: SopState) => state.univercities || []);
export const selectPlag$ = createSelector(featureSelect, (state: SopState) => ({
    plag: state.Plagiarism,
    grammar: state.grammer
}));
export const selectIsAnalyseBtnEnabaled$ = createSelector(featureSelect, (state: SopState) => {
    const courses = state.course || [];
    if (courses?.length < 1 || state.university == -1 || state.country == -1) {
        return false;
    }
    return true;
});

export const selectVerifyPageData$ = createSelector(featureSelect, (state: SopState) => {
    return {
        docId: state.docId || 0,
        data: state.document || '',
        country: state.country || 0,
        university: state.university || 0,
        course: state.course && state.course?.length > 0 ? state.course.join(',') : ''
    }
});

export const selectVerified$ = createSelector(featureSelect, (state: SopState) => ({
    positive: state.positive,
    negative: state.negative
}));