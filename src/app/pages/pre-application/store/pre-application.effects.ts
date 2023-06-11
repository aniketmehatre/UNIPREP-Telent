import {Injectable} from "@angular/core";

import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {
    loadQuestionList,
    loadQuizList,
    loadQuizListSuccess,
    loadQuestionListSuccess,
    loadSubModules,
    loadSubModulesSuccess
} from "./pre-application.actions";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {PreApplicationService} from "./pre-application.service";

@Injectable()
export class PreApplicationEffects {
    loadSubModules = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.preApplicationService.loadSubModules(payload.countryId).pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodulecount})
            })
        ))
    ));
    loadQuestionList = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionList),
        switchMap((payload) => this.preApplicationService.loadQuestionList({
            countryId: payload.countryId,
            moduleId: payload.moduleId,
            submoduleId: payload.submoduleId
        }).pipe(
            map(response => {
                return loadQuestionListSuccess({questionList: response.questions})
            })
        ))
    ));

    loadQuizList = createEffect(() => this.actions$.pipe(
        ofType(loadQuizList),
        switchMap((payload) => this.preApplicationService.loadQuizList({
            countryId: payload.countryId,
            moduleId: payload.moduleId,
            submoduleId: payload.submoduleId
        }).pipe(
            map(response => {
                return loadQuizListSuccess({quizList: response.quizquestion})
            })
        ))
    ));

    constructor(private actions$: Actions, private preApplicationService: PreApplicationService,
    ) {
    }
}
