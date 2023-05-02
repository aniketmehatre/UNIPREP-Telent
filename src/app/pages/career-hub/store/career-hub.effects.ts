import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {loadQuestionList, loadQuestionListSuccess, loadSubModules, loadSubModulesSuccess} from "./career-hub.actions";
import { CareerHubService } from "./career-hub.service";

@Injectable()
export class CareerHubEffects {
    constructor(private actions$: Actions, private careerHubService: CareerHubService) {
    }

    loadSubModules$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.careerHubService.loadSubModules(payload.countryId).pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodulecount})
            })
        ))
    ));

    loadQuestionList = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionList),
        switchMap((payload) => this.careerHubService.loadQuestionList({
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