import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Client } from '../../models/client.model';
import { ClientActions } from './client.actions';

export interface ClientState extends EntityState<Client> {
  loading: boolean;
  error: string | null;
}

export const clientAdapter: EntityAdapter<Client> = createEntityAdapter<Client>();

export const initialClientState: ClientState = clientAdapter.getInitialState({
  loading: false,
  error: null,
});

export const clientReducer = createReducer(
  initialClientState,

  // Load
  on(ClientActions.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) =>
    clientAdapter.setAll(clients, { ...state, loading: false }),
  ),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create
  on(ClientActions.addClient, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.addClientSuccess, (state, { client }) =>
    clientAdapter.addOne(client, { ...state, loading: false }),
  ),
  on(ClientActions.addClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(ClientActions.updateClientSuccess, (state, { client }) =>
    clientAdapter.updateOne({ id: client.id, changes: client }, { ...state, loading: false }),
  ),

  // Delete
  on(ClientActions.deleteClientSuccess, (state, { id }) =>
    clientAdapter.removeOne(id, { ...state, loading: false }),
  ),
);
