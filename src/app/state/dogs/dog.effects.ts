import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DogService } from "../../core/services/dog.service";
import { catchError, map, mergeMap, of } from "rxjs";
import { DogActions } from "./dog.actions";


@Injectable()
export class DogEffects {

    private action$ = inject(Actions);
    private dogService = inject(DogService);

    loadDogs$ = createEffect(() =>
        this.action$.pipe(
            ofType(DogActions.loadDogs),
            mergeMap(() =>
                this.dogService.getAll().pipe(
                    map((dogs) => DogActions.loadDogsSuccess({ dogs })),
                    catchError(error => of(DogActions.loadDogsFailure({ error: error.message })))
                )
            )
        )
    );

    addDog$ = createEffect(() =>
        this.action$.pipe(
            ofType(DogActions.addDog),
            mergeMap(({ dog }) =>
                this.dogService.create(dog).pipe(
                    map((newDog) => DogActions.addDogSuccess({ dog: newDog })),
                    catchError(error => of(DogActions.addDogFailure({ error: error.message })))
                )
            )
        )
    );

    updateDog$ = createEffect(() =>
        this.action$.pipe(
            ofType(DogActions.updateDog),
            mergeMap(({ dog }) =>
                this.dogService.update(dog).pipe(
                    map((updatedDog) => DogActions.updateDogSuccess({ dog: updatedDog })),
                    catchError(error => of(DogActions.updateDogFailure({ error: error.message })))
                )
            )
        )
    );
    
    deleteDog$ = createEffect(() =>
        this.action$.pipe(
            ofType(DogActions.deleteDog),
            mergeMap(({ id }) =>
                this.dogService.delete(id).pipe(
                    map(() => DogActions.deleteDogSuccess({ id })),
                    catchError(error => of(DogActions.deleteDogFailure({ error: error.message })))
                )
            )
        )
    );
}