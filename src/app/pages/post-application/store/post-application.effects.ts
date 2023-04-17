import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {PostApplicationService} from "./post-application.service";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {loadSubModules, loadSubModulesSuccess} from "./post-application.actions";

@Injectable()
export class PostApplicationEffects {
    constructor(private actions$: Actions, private postApplicationService: PostApplicationService) {
    }

    loadSubModules$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap(() => this.postApplicationService.loadSubModules().pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodules})
            })
        ))
    ));
}