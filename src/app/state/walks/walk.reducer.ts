import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Walk } from '../../models/walk.model';
import { WalkActions } from './walk.actions';

export interface WalkState extends EntityState<Walk> {
  loading: boolean;
  error: string | null;
}

export const walkAdapter: EntityAdapter<Walk> = createEntityAdapter<Walk>();

export const initialWalkState: WalkState = walkAdapter.getInitialState({
  loading: false,
  error: null,
});

export const walkReducer = createReducer(
  initialWalkState,

  // Load
  on(WalkActions.loadWalks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(WalkActions.loadWalksSuccess, (state, { walks }) =>
    walkAdapter.setAll(walks, { ...state, loading: false }),
  ),
  on(WalkActions.loadWalksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create
  on(WalkActions.createWalk, (state) => ({
    ...state,
    loading: true,
  })),
  on(WalkActions.createWalkSuccess, (state, { walk }) =>
    walkAdapter.addOne(walk, { ...state, loading: false }),
  ),
  on(WalkActions.createWalkFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(WalkActions.updateWalkSuccess, (state, { walk }) =>
    walkAdapter.updateOne({ id: walk.id, changes: walk }, { ...state, loading: false }),
  ),

  // Delete
  on(WalkActions.deleteWalkSuccess, (state, { id }) =>
    walkAdapter.removeOne(id, { ...state, loading: false }),
  ),
);
