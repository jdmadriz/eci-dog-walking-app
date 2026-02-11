import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { dogReducer } from './state/dogs/dog.reducer';
import { walkReducer } from './state/walks/walk.reducer';
import { clientReducer } from './state/clients/client.reducer';

import { ClientEffects } from './state/clients/client.effect';
import { DogEffects } from './state/dogs/dog.effects';
import { WalkEffects } from './state/walks/walk.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
      clients: clientReducer,
      dogs: dogReducer,
      walks: walkReducer
    }),
    provideEffects([ClientEffects, DogEffects, WalkEffects]),
    provideStoreDevtools({
      maxAge: 25, // retains last 25 state changes
      logOnly: !isDevMode(), // restrict extension to log-only mode in production 
    })
  ]
};
