import { createActionGroup, props } from '@ngrx/store';
import { LoginRequest } from 'src/app/@Models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
'Login': props<{ request: LoginRequest }>(),  // ✅ Wrap LoginRequest inside an object
    'Login Success': props<{token: string}>(),
    'Login Failure': props<{error?: string}>(),
  }
});