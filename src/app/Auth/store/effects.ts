import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { AuthActions } from './actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.isAuthenticated(action).pipe(
          map((response) => AuthActions.loginSuccess({ token: response.token })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}