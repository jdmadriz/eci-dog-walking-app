import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logout, () => ({
    ...initialAuthState,
  })),

  // Check Auth (restore from localStorage)
  on(AuthActions.checkAuthSuccess, (state, { user }) => ({
    ...state,
    user,
  })),
  on(AuthActions.checkAuthFailure, (state) => ({
    ...state,
    user: null,
  })),
);
