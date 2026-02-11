import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { Client } from '../../models/client.model';

export const ClientActions = createActionGroup({
  source: 'Client',
  events: {
    'Load Clients': emptyProps(),
    'Load Clients Success': props<{ clients: Client[] }>(),
    'Load Clients Failure': props<{ error: string }>(),

    'Add Client': props<{ client: Omit<Client, 'id' | 'createdAt'> }>(),
    'Add Client Success': props<{ client: Client }>(),
    'Add Client Failure': props<{ error: string }>(),

    'Update Client': props<{ client: Client }>(),
    'Update Client Success': props<{ client: Client }>(),
    'Update Client Failure': props<{ error: string }>(),

    'Delete Client': props<{ id: string }>(),
    'Delete Client Success': props<{ id: string }>(),
    'Delete Client Failure': props<{ error: string }>(),
  },
});

