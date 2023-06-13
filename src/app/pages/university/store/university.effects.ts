import {Injectable} from "@angular/core";

import {switchMap} from "rxjs";
import {map} from "rxjs/operators";

import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadQuestionList, loadQuestionListSuccess, loadSubModules, loadSubModulesSuccess} from "./university.actions";
import {UniversityService} from "./university.service";

@Injectable()
export class UniversityEffects {

    constructor(private actions$: Actions, private universityService: UniversityService,
    ) {
    }
    loadSubModules = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.universityService.loadSubModules(payload.countryId).pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodulecount})
            })
        ))
    ));
    loadQuestionList = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionList),
        switchMap((payload) => this.universityService.loadQuestionList({
            countryId: payload.countryId,
            moduleId: payload.moduleId,
            submoduleId: payload.submoduleId
        }).pipe(
            map(response => {
                return loadQuestionListSuccess({questionList: response.questions})
            })
        ))
    ));

}
