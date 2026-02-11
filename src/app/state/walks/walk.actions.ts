import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Walk } from '../../models/walk.model';

export const WalkActions = createActionGroup({
  source: 'Walks',
  events: {
    'Load Walks': emptyProps(),
    'Load Walks Success': props<{ walks: Walk[] }>(),
    'Load Walks Failure': props<{ error: string }>(),

    'Create Walk': props<{ walk: Omit<Walk, 'id'> }>(),
    'Create Walk Success': props<{ walk: Walk }>(),
    'Create Walk Failure': props<{ error: string }>(),

    'Update Walk': props<{ walk: Walk }>(),
    'Update Walk Success': props<{ walk: Walk }>(),
    'Update Walk Failure': props<{ error: string }>(),

    'Delete Walk': props<{ id: string }>(),
    'Delete Walk Success': props<{ id: string }>(),
    'Delete Walk Failure': props<{ error: string }>(),
  },
});
