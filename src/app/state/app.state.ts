import { ClientState } from "./clients/client.reducer";
import { DogState } from "./dogs/dog.reducer";
import { WalkState } from "./walks/walk.reducer";


export interface AppState {
    clients: ClientState;
    dogs: DogState;
    walks: WalkState;
}