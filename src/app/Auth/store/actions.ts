import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest } from "src/app/@Models/auth.model";

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    login: props<{ request: LoginRequest }>(), // ✅ Ensure request is an object
    'Login Success': props<{ token: string }>(),
    'Login Failure': props<{ error?: string }>(),
    logout: emptyProps(), // ✅ Use emptyProps() for actions without payload
  },
});