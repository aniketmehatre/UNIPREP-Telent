import { createFeature } from '@ngrx/store';
import { authReducer } from './reducer';

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const {
  selectLoading,
  selectLoggedIn,
  selectMessage,
  selectLoginData,
  selectError
} = authFeature;