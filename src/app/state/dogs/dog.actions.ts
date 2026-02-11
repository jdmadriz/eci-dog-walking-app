import { createActionGroup, props, emptyProps } from "@ngrx/store";
import { Dog } from "../../models/dog.model";

export const DogActions = createActionGroup({
  source: "Dog",
  events: {
    "Load Dogs": emptyProps(),
    "Load Dogs Success": props<{ dogs: Dog[] }>(),
    "Load Dogs Failure": props<{ error: string }>(),

    "Add Dog": props<{ dog: Omit<Dog, 'id' | 'createdAt'> }>(),
    "Add Dog Success": props<{ dog: Dog }>(),
    "Add Dog Failure": props<{ error: string }>(),

    "Update Dog": props<{ dog: Dog }>(),
    "Update Dog Success": props<{ dog: Dog }>(),
    "Update Dog Failure": props<{ error: string }>(),

    "Delete Dog": props<{ id: string }>(),
    "Delete Dog Success": props<{ id: string }>(),
    "Delete Dog Failure": props<{ error: string }>(),
  },
});