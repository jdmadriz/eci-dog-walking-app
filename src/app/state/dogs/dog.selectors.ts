import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DogState, dogAdapter } from './dog.reducer';

export const selectDogState = createFeatureSelector<DogState>('dogs');

const { selectAll, selectEntities } = dogAdapter.getSelectors();

export const selectAllDogs = createSelector(
  selectDogState,
  selectAll
);

export const selectDogEntities = createSelector(
  selectDogState,
  selectEntities
);

export const selectDogById = (id: string) =>
  createSelector(selectDogEntities, (entities) => entities[id]);

export const selectDogsByClientId = (clientId: string) =>
  createSelector(selectAllDogs, (dogs) =>
    dogs.filter((dog) => dog.clientId === clientId)
  );

export const selectDogsLoading = createSelector(
  selectDogState,
  (state) => state.loading
);

export const selectDogsError = createSelector(
  selectDogState,
  (state) => state.error
);