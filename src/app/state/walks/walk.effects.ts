import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { WalkService } from "../../core/services/walk.service";
import { catchError, map, mergeMap, of } from "rxjs";
import { WalkActions } from "./walk.actions";

@Injectable()
export class WalkEffects {

    private action$ = inject(Actions);
    private walkService = inject(WalkService);

    loadWalks$ = createEffect(() =>
        this.action$.pipe(
            ofType(WalkActions.loadWalks),
            mergeMap(() =>
                this.walkService.getAll().pipe(
                    map((walks) => WalkActions.loadWalksSuccess({ walks })),
                    catchError(error => of(WalkActions.loadWalksFailure({ error: error.message })))
                )
            )
        )
    );

    addWalk$ = createEffect(() =>
        this.action$.pipe(
            ofType(WalkActions.createWalk),
            mergeMap(({ walk }) =>
                this.walkService.create(walk).pipe(
                    map((newWalk) => WalkActions.createWalkSuccess({ walk: newWalk })),
                    catchError(error => of(WalkActions.createWalkFailure({ error: error.message })))
                )
            )
        )
    );

    updateWalk$ = createEffect(() =>
        this.action$.pipe(
            ofType(WalkActions.updateWalk),
            mergeMap(({ walk }) =>
                this.walkService.update(walk).pipe(
                    map((updatedWalk) => WalkActions.updateWalkSuccess({ walk: updatedWalk })),
                    catchError(error => of(WalkActions.updateWalkFailure({ error: error.message })))
                )
            )
        )
    );
    
    deleteWalk$ = createEffect(() =>
        this.action$.pipe(
            ofType(WalkActions.deleteWalk),
            mergeMap(({ id }) =>
                this.walkService.delete(id).pipe(
                    map(() => WalkActions.deleteWalkSuccess({ id })),
                    catchError(error => of(WalkActions.deleteWalkFailure({ error: error.message })))
                )
            )
        )
    );
}