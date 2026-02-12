import { AuthState } from "./auth/auth.reducer";
import { ClientState } from "./clients/client.reducer";
import { DogState } from "./dogs/dog.reducer";
import { WalkState } from "./walks/walk.reducer";


export interface AppState {
    auth: AuthState;
    clients: ClientState;
    dogs: DogState;
    walks: WalkState;
}