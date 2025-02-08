import { authFeature } from './reducer';

export const {
  selectAuthState,
  selectLoading,
  selectLoggedIn,
  selectMessage,
  selectLoginData,
  selectError
} = authFeature;