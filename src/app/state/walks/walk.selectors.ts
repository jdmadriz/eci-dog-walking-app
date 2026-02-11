import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WalkState, walkAdapter } from './walk.reducer';

export const selectWalkState = createFeatureSelector<WalkState>('walks');

const { selectAll, selectEntities } = walkAdapter.getSelectors();
export const selectAllWalks = createSelector(
  selectWalkState,
  selectAll
);

export const selectWalkEntities = createSelector(
  selectWalkState,
  selectEntities
);

export const selectWalkById = (id: string) =>
  createSelector(selectWalkEntities, (entities) => entities[id]);

export const selectWalksByDogId = (dogId: string) =>
 createSelector(selectAllWalks, (walks) =>
   walks.filter((walk) => walk.dogId === dogId)
 );

export const selectWalksLoading = createSelector(
  selectWalkState,
  (state) => state.loading
);
  
export const selectWalksError = createSelector(
  selectWalkState,
  (state) => state.error
);