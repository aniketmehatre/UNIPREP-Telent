import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {SopStoreService} from "./service";
import {switchMap, withLatestFrom} from "rxjs";
import {map} from "rxjs/operators";
import {
    checkPlag,
    checkPlagSuccess,
    loadCountries,
    loadCountriesSuccess,
    loadCourse,
    loadCourseSuccess,
    loadUnivercityByCountry,
    loadUnivercityByCountrySuccess,
    selectOptions,
    selectOptionsSuccess,
    updateDoc,
    updateDocSuccess,
    uploadDoc,
    uploadDocSuccess,
    verifyPlag,
    verifyPlagSuccess
} from "./actions";
import {select, Store} from "@ngrx/store";
import {SopState} from "./reducer";
import {selectVerifyPageData$} from "./selectors";

@Injectable()
export class SopEffects {
    uploadDoc$ = createEffect(() => this.actions$.pipe(
        ofType(uploadDoc),
        switchMap((payload) => this.service.getTextExtractionfromDoc({document: payload.document}).pipe(
            map(response => uploadDocSuccess({data: response}))
        ))
    ));
    updateDoc$ = createEffect(() => this.actions$.pipe(
        ofType(updateDoc),
        switchMap((payload) => this.service.updateDocument(payload.docId, payload.data).pipe(
            map(response => updateDocSuccess({data: response}))
        ))
    ));
    selectOptions$ = createEffect(() => this.actions$.pipe(
        ofType(selectOptions),
        withLatestFrom(this.store.pipe(select(selectVerifyPageData$))),
        switchMap(([payload, form]) => this.service.selectOptions({
            docId: form.docId,
            country: form.country,
            course: form.course,
            university: form.university
        }).pipe(
            map(response => selectOptionsSuccess({data: response}))
        ))
    ));
    loadCourse$ = createEffect(() => this.actions$.pipe(
        ofType(loadCourse),
        switchMap((payload) => this.service.getCourses().pipe(
            map(response => loadCourseSuccess({data: response}))
        ))
    ));
    loadCountries$ = createEffect(() => this.actions$.pipe(
        ofType(loadCountries),
        switchMap((payload) => this.service.getCountries().pipe(
            map(response => loadCountriesSuccess({data: response}))
        ))
    ));
    loadUnivercityByCountry$ = createEffect(() => this.actions$.pipe(
        ofType(loadUnivercityByCountry),
        switchMap((payload) => this.service.universitiesByCountry(payload.id).pipe(
            map(response => loadUnivercityByCountrySuccess({data: response}))
        ))
    ));
    checkPlag$ = createEffect(() => this.actions$.pipe(
        ofType(checkPlag),
        withLatestFrom(this.store.pipe(select(selectVerifyPageData$))),
        switchMap(([payload, form]) => this.service.checkPlagFromData(payload.data, form.docId).pipe(
            map(response => checkPlagSuccess(response))
        ))
    ));
    verifyPlag$ = createEffect(() => this.actions$.pipe(
        ofType(verifyPlag),
        withLatestFrom(this.store.pipe(select(selectVerifyPageData$))),
        switchMap(([payload, form]) => this.service.verifyPlagFromData({data: form.data, docId: form.docId}).pipe(
            map(response => verifyPlagSuccess({data: response}))
        ))
    ));

    constructor(
        private actions$: Actions,
        private service: SopStoreService,
        private store: Store<SopState>
    ) {
    }
}