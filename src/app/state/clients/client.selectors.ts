import { createFeatureSelector, createSelector } from "@ngrx/store";
import { clientAdapter, ClientState } from "./client.reducer";


export const selectClientState = createFeatureSelector<ClientState>('clients');

const { selectAll, selectEntities } = clientAdapter.getSelectors(); 

export const selectAllClients = createSelector(
    selectClientState,
    selectAll
  );

  export const selectClientEntities = createSelector(
    selectClientState,
    selectEntities
  );

  export const selectClientById = (id: string) =>
    createSelector(selectClientEntities, (entities) => entities[id]);

  export const selectClientsLoading = createSelector(
    selectClientState,
    (state) => state.loading
  );

  export const selectClientsError = createSelector(
    selectClientState,
    (state) => state.error
  );