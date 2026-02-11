import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dog } from '../../models/dog.model';
import { DogActions } from './dog.actions';

export interface DogState extends EntityState<Dog> {
  loading: boolean;
  error: string | null;
}

export const dogAdapter: EntityAdapter<Dog> = createEntityAdapter<Dog>();

export const initialDogState: DogState = dogAdapter.getInitialState({
  loading: false,
  error: null,
});

export const dogReducer = createReducer(
  initialDogState,

  // Load
  on(DogActions.loadDogs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DogActions.loadDogsSuccess, (state, { dogs }) =>
    dogAdapter.setAll(dogs, { ...state, loading: false }),
  ),
  on(DogActions.loadDogsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create
  on(DogActions.addDog, (state) => ({
    ...state,
    loading: true,
  })),
  on(DogActions.addDogSuccess, (state, { dog }) =>
    dogAdapter.addOne(dog, { ...state, loading: false }),
  ),
  on(DogActions.addDogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update
  on(DogActions.updateDogSuccess, (state, { dog }) =>
    dogAdapter.updateOne({ id: dog.id, changes: dog }, { ...state, loading: false }),
  ),

  // Delete
  on(DogActions.deleteDogSuccess, (state, { id }) =>
    dogAdapter.removeOne(id, { ...state, loading: false }),
  ),
);
