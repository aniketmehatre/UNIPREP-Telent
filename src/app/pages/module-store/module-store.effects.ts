import {Injectable} from "@angular/core";

import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {
    loadQuestionList,
    loadQuizList,
    loadQuizListSuccess,
    loadQuestionListSuccess,
    loadSubModules,
    loadSubModulesSuccess,
    readQuestion, readQuestionSuccess
} from "./module-store.actions";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {ModuleStoreService} from "./module-store.service";

@Injectable()
export class ModuleStoreEffects {
    constructor(private actions$: Actions, private preApplicationService: ModuleStoreService,
    ) {
    }

    loadSubModules = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.preApplicationService.loadSubModules(
            {countryId: payload.countryId, api_module_name: payload.api_module_name}).pipe(
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

    readQuestion = createEffect(() => this.actions$.pipe(
        ofType(readQuestion),
        switchMap((payload) => this.preApplicationService.readQuestion(
            {questionId: payload.questionId, countryId: payload.countryId, moduleId: payload.moduleId,
                submoduleId: payload.submoduleId}
        ).pipe(
            map(response => {
                return readQuestionSuccess({submodules: response})
            })
        ))
    ));


}
