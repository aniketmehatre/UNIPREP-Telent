import {Injectable} from "@angular/core";

import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import {loadSubModules, loadSubModulesSuccess} from "./post-admission.actions";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {PostAdmissionService} from "./post-admission.service";


@Injectable()
 export class PostAdmissionEffects {
    constructor(private actions$: Actions, private postAdmissionService: PostAdmissionService,
                ) {
    }

    loadSubModules = createEffect(() => this.actions$.pipe(
        ofType(loadSubModules),
        switchMap((payload) => this.postAdmissionService.loadSubModules().pipe(
            map(response => {
                return loadSubModulesSuccess({submodules: response.submodules})
            })
        ))
    ));
}
