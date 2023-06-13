import {Injectable} from "@angular/core";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {loadQuestionList, loadSubModules, loadSubModulesSuccess} from "./life-at.actions";
import {LifeAtService} from "./life-at.service";
import {loadQuestionListSuccess} from "../../pre-application/store/pre-application.actions";

@Injectable()
export class LifeAtEffects {
    constructor(private actions$: Actions, private lifeAtService: LifeAtService) {
    }

    loadSubModules = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) =>
            this.lifeAtService.loadSubModules(payload.countryId).pipe(
                map(response => {
                    return loadSubModulesSuccess({submodules: response.submodulecount})
                })
            ))
    ));
    loadQuestionList = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionList),
        switchMap((payload) => this.lifeAtService.loadQuestionList({
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