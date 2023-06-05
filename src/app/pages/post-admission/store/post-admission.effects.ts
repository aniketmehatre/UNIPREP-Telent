import {Injectable} from "@angular/core";

import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {loadQuestionList, loadSubModules, loadSubModulesSuccess} from "./post-admission.actions";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {PostAdmissionService} from "./post-admission.service";
import {loadQuestionListSuccess} from "../../pre-application/store/pre-application.actions";


@Injectable()
export class PostAdmissionEffects {
    loadSubModules = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.postAdmissionService.loadSubModules(payload.countryId).pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodulecount})
            })
        ))
    ));
    loadQuestionList = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionList),
        switchMap((payload) => this.postAdmissionService.loadQuestionList({
            countryId: payload.countryId,
            moduleId: payload.moduleId,
            submoduleId: payload.submoduleId
        }).pipe(
            map(response => {
                return loadQuestionListSuccess({questionList: response.questions})
            })
        ))
    ));

    constructor(private actions$: Actions, private postAdmissionService: PostAdmissionService,
    ) {
    }

}
