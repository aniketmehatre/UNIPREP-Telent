import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {PostApplicationService} from "./post-application.service";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {loadQuestionList, loadSubModules, loadSubModulesSuccess} from "./post-application.actions";
import {loadQuestionListSuccess} from "../../pre-application/store/pre-application.actions";

@Injectable()
export class PostApplicationEffects {
    loadSubModules$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.postApplicationService.loadSubModules(payload.countryId).pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodulecount})
            })
        ))
    ));
    loadQuestionList = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionList),
        switchMap((payload) => this.postApplicationService.loadQuestionList({
            countryId: payload.countryId,
            moduleId: payload.moduleId,
            submoduleId: payload.submoduleId
        }).pipe(
            map(response => {
                return loadQuestionListSuccess({questionList: response.questions})
            })
        ))
    ));

    constructor(private actions$: Actions, private postApplicationService: PostApplicationService) {
    }
}