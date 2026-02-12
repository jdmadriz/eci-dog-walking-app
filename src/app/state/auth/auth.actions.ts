import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User } from '../../models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),

    'Logout': emptyProps(),

    'Check Auth': emptyProps(),
    'Check Auth Success': props<{ user: User }>(),
    'Check Auth Failure': emptyProps(),
  },
});
