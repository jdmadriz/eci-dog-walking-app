import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ClientService } from "../../core/services/client.service";
import { catchError, map, mergeMap, of } from "rxjs";
import { ClientActions } from "./client.actions";


@Injectable()

export class ClientEffects {
    private action$ = inject(Actions);
    private clientService = inject(ClientService);

    loadClients$ = createEffect(() =>
        this.action$.pipe(
            ofType(ClientActions.loadClients),
            mergeMap(() =>
                this.clientService.getAll().pipe(
                    map((clients) => ClientActions.loadClientsSuccess({ clients })),
                    catchError(error => of(ClientActions.loadClientsFailure({ error: error.message })))
                )
            )
        )
    );

    addClient$ = createEffect(() =>
        this.action$.pipe(
            ofType(ClientActions.addClient),
            mergeMap(({ client }) =>
                this.clientService.create(client).pipe(
                    map((newClient) => ClientActions.addClientSuccess({ client: newClient })),
                    catchError(error => of(ClientActions.addClientFailure({ error: error.message })))
                )
            )
        )
    );

    updateClient$ = createEffect(() =>
        this.action$.pipe(
            ofType(ClientActions.updateClient),
            mergeMap(({ client }) =>
                this.clientService.update(client).pipe(
                    map((updatedClient) => ClientActions.updateClientSuccess({ client: updatedClient })),
                    catchError(error => of(ClientActions.updateClientFailure({ error: error.message })))
                )
            )
        )
    );

    deleteClient$ = createEffect(() =>
        this.action$.pipe(
            ofType(ClientActions.deleteClient),
            mergeMap(({ id }) =>
                this.clientService.delete(id).pipe(
                    map(() => ClientActions.deleteClientSuccess({ id })),
                    catchError(error => of(ClientActions.deleteClientFailure({ error: error.message })))
                )
            )
        )
    );
}